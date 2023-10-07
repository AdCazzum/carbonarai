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
import requests
import http.client
import json

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
    "/bitapai",
    response_model=chat_response,
    summary="Get response from Bitapai Chat Completion with prompt string and result count",
    response_description="Answer (string which represents the completion) and sources used",
)
async def chat_handler(request: Request, prompt: prompt):

    with open("app/graphql/ens.root.object", "r") as f:
        q_roots = f.read()

    with open("app/graphql/ens.graphql", "r") as f:
        txt = f.read()

    system_prompt=f"""
    Given the following graphql schema:
    ```
    {txt}
    ```
        
    Translate the following into a syntactically valid graphql query.
    Try to not invent new fields, but use the ones already defined in the schema.
        
    ```
    ${prompt}
    ```
    """

    print(system_prompt)

    conn = http.client.HTTPSConnection("api.bitapai.io")
    print('http.client.HTTPSConnection("api.bitapai.io"')

    payload = json.dumps({
        "messages": [
            {
            "role": "system",
            "content": "You are an AI assistant"
            },
            {
            "role": "user",
            "content": "What is the meaning of life?"
            },
            {
            "role": "assistant",
            "content": "42"
            }
        ],
        "count": 1,
        "return_all": True
    })
    headers = {
        'Content-Type': 'application/json',
        'X-API-KEY': 'KEY'
    }

    print("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")

    conn.request("POST", "/text", payload, headers)

    print("###############################")

    res = conn.getresponse()
    data = res.read()
    print(data.decode("utf-8"))

    # Parse the JSON data
    data = json.loads(data.decode("utf-8"))

    return chat_response(answer=str(data["choices"][0]))


@router.post(
    "/answer",
    response_model=chat_response,
    summary="Get response from OpenAI Chat Completion with prompt string and result count",
    response_description="Answer (string which represents the completion) and sources used",
)
async def chat_handler(request: Request, prompt: prompt):
    _logger.info({"message": "Calling Chat Endpoint"})

    try:
        # URL del servizio GraphQL
        url = f'https://api.thegraph.com/subgraphs/name/ensdomains/ens'

        with open("app/graphql/ens.root.object", "r") as f:
            q_roots = f.read()

        with open("app/graphql/ens.graphql", "r") as f:
            txt = f.read()

        # Funzione per generare la query GraphQL utilizzando GPT-3.5
        def generate_graphql_query(p):
            prompt=f"""
            Given the following graphql schema:
            ```
            {txt}
            ```
                
            Translate the following into a syntactically valid graphql query.
            Try to not invent new fields, but use the ones already defined in the schema.
                
            ```
            ${p}
            ```
            """
            response = openai.Completion.create(
                model="gpt-3.5-turbo-instruct",
                # engine="davinci-002",
                prompt=prompt,
                max_tokens=200
            )
            return response.choices[0].text.strip().replace("`", "").strip()

        retry = True
        while retry:
                
            # Prompt per generare la query GraphQL
            # prompt = "Give me the first 3 domains"
            query = generate_graphql_query(prompt)

            print("------------------")
            print(query)
            print("------------------")

            # Parametri della richiesta GraphQL
            variables = {}

            # Creazione della richiesta POST
            response = requests.post(url, json={'query': query, 'variables': variables})

            # Verifica della risposta
            if not response.status_code == 200:
                data = response.json()
                print(f'Errore nella richiesta GraphQL: {response.status_code}')
                print(response.text)
                retry = True  # Set retry to True to retry the request
            else:
                graphql_response = response.json()
                if "errors" in graphql_response:
                    print("GraphQL response contains errors. Retrying...")
                    retry = True
                else:
                    retry = False  # Set retry to False to stop retrying

        # Verifica della risposta
        if not response.status_code == 200:
            data = response.json()
            print(f'Errore nella richiesta GraphQL: {response.status_code}')
            print(response.text)
            exit(1)

        promptai = f"""
        You are CarbonarAI, a friendly and helpful AI assistant by developed at EthRome2023 that provides help with interpreting GraphQL responses.
        You give thorough answers. Use the following pieces of context to help answer the users question. If its not relevant to the question, provide friendly responses.
        If you cannot answer the question or find relevant meaning in the context, tell the user to try re-phrasing the question. Use the settings below to configure this prompt and your answers.

        <User Query>
        {prompt}

        <response>
        ```       
        {response.text}
        ```
        """

        print(promptai)

        retry = True
        while retry:
            try:
                response = openai.Completion.create(
                        model="gpt-3.5-turbo-instruct",
                        prompt=promptai,
                        max_tokens=500
                    )
                print(f'!!!!!!!!!!!!!!!!!!!!!!: {response}')
                retry = False

                # if not response.status_code == 200:
                #     print(f'Errore nella richiesta GraphQL')
                #     retry = True  # Set retry to True to retry the request
                # else:
                #     print('???????????????? {response}')
                #     retry = False  # Set retry to False to stop retrying
            except Exception as e:
                print(e)
                retry = True
                _logger.error({"message": "Error generating chat completion"})
                raise exceptions.InvalidChatCompletionException


        print(response.choices[0].text)
        print("##########################################################################################")

    except Exception as e:
        print(e)
        _logger.error({"message": "Error generating chat completion"})
        raise exceptions.InvalidChatCompletionException

    return chat_response(answer=str(response.choices[0].text))
