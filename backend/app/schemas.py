from pydantic import BaseModel, HttpUrl

class prompt(BaseModel):
    query: str
    chatTypeKey: str
    # temperature: float | None = 0.00
    # similarity_threshold: float | None = 0.50
    # sentences: str | None = "short"
    # results: int | None = 5

class chunk(BaseModel):
    page_title: str
    page_url: HttpUrl
    content: str
    similarity: float

class chat_response(BaseModel):
    answer: str
