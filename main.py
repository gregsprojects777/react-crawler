
from fastapi import FastAPI, Request, Form
from fastapi.responses import HTMLResponse, FileResponse
from fastapi.staticfiles import StaticFiles
from pathlib import Path
from crawler.core import crawl_multiple_domains
import asyncio

app = FastAPI()

# React build einbinden
app.mount("/static", StaticFiles(directory="build/static"), name="static")

@app.get("/", response_class=HTMLResponse)
async def serve_react_index():
    return FileResponse("build/index.html")

@app.post("/crawl", response_class=HTMLResponse)
async def start_crawl(
    domains: str = Form(...),
    keywords: str = Form(...),
    max_depth: int = Form(1),
    max_pages: int = Form(10),
):
    domain_list = [d.strip() for d in domains.split(",") if d.strip()]
    keyword_list = [k.strip() for k in keywords.split(",") if k.strip()]
    results = await crawl_multiple_domains(domain_list, keyword_list, max_depth, max_pages)
    return results
