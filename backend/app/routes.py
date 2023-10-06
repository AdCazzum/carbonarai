from fastapi import APIRouter
import os
import openai
import numpy as np
from app.schemas import prompt, chat_response
import app.exceptions as exceptions
from fastapi import Request
import logging
from llama_hub.tools.graphql.base import GraphQLToolSpec
from llama_index.agent import OpenAIAgent


# openai.api_key = os.environ["OPENAI_API_KEY"]

router = APIRouter()
_logger = logging.getLogger(__name__)

# TODO correct place?
tool_spec = GraphQLToolSpec(
  # url = 'https://spacex-production.up.railway.app/',
  url ='https://api.thegraph.com/subgraphs/name/ensdomains/ens',
  headers = {
      'content-type': 'application/json'
  }
)

@router.post(
    "/answer",
    response_model=chat_response,
    summary="Get response from OpenAI Chat Completion with prompt string and result count",
    response_description="Answer (string which represents the completion) and sources used",
)
async def chat_handler(request: Request, prompt: prompt):
    _logger.info({"message": "Calling Chat Endpoint"})

    try:
        _logger.info({"message": "Using Chat Completion"})
        _logger.info({"message": f"Prompt is {prompt.query}"})
        
        with open("app/graphql/ens.root.object", "r") as f:
            q_roots = f.read()

        # FIXME this should be created only one time probablt
        agent = OpenAIAgent.from_tools(tool_spec.to_tool_list(), 
        system_prompt=f"""
            You are a specialized Agent with access to the The Graph API for a blockchain search engine.
            Your job is to chat with blockchain experts and help them run GraphQL queries, interpreting the results for the user
            For you conveinence, the QueryRoot objects are listed here.
            
            {q_roots}
            
            QueryRoots are the schema's entry-point for queries. This acts as the public, top-level API from which all queries must start.
            You can use graphql_writer to query the schema and assist in writing queries.
            If the GraphQL you execute returns an error, either directly fix the query, or directly ask the graphql_writer questions about the schema instead of writing graphql queries.
            Then use that information to write the correct graphql query
        """)
        answer = agent.chat(prompt.query)

        _logger.info({"message": f"Answer is {answer}"})
        
    except Exception as e:
        print(e)
        _logger.error({"message": "Error generating chat completion"})
        raise exceptions.InvalidChatCompletionException

    return chat_response(answer=str(answer))
