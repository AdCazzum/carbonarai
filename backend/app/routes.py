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
  url = 'https://spacex-production.up.railway.app/',
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
        
        # FIXME this should be created only one time probablt
        agent = OpenAIAgent.from_tools(tool_spec.to_tool_list())
        answer = agent.chat(prompt.query)

    except Exception as e:
        print(e)
        _logger.error({"message": "Error generating chat completion"})
        raise exceptions.InvalidChatCompletionException

    return chat_response(answer=str(answer))
