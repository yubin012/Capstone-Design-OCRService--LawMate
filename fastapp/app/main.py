from fastapi import FastAPI, Request
from pydantic import BaseModel
from inference import klue_bert, case_faiss, another_model

app = FastAPI()

class TextInput(BaseModel):
    text: str

@app.post("/inference/bert")
def infer_with_bert(data: TextInput):
    return klue_bert.predict(data.text)

@app.post("/inference/faiss")
def search_case(data: TextInput):
    return case_faiss.search(data.text)

@app.post("/inference/another")
def infer_other(data: TextInput):
    return another_model.run(data.text)
