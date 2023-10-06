from fastapi.staticfiles import StaticFiles
import os
from llama_hub.tools.graphql.base import GraphQLToolSpec
from llama_index.agent import OpenAIAgent
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import router as api_router
import logging
import yaml
from logging.config import dictConfig
from pathlib import Path

dictConfig(yaml.safe_load(Path("logging.yaml").read_text()))
_logger = logging.getLogger(__name__)

app = FastAPI()
dir_path = os.path.dirname(os.path.realpath(__file__))
app.mount("/static", StaticFiles(directory=dir_path +
          "/../static"), name="static")

app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_headers=["*"],
    allow_methods=["*"],
    allow_origins=["*"],
    allow_credentials=True,
)


@app.on_event("startup")
async def startup():    
    _logger.info({"message": "FastAPI startup event"})


@app.on_event("shutdown")
async def shutdown():
    _logger.info({"message": "FastAPI shutdown event"})
