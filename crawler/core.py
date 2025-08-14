
import asyncio
from typing import List
from playwright.async_api import async_playwright
import psutil
import time

async def crawl_single_page(url: str, keywords: List[str]) -> dict:
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()
        await page.goto(url)
        content = await page.content()
        matches = [kw for kw in keywords if kw.lower() in content.lower()]
        title = await page.title()
        await browser.close()
        return {
            "url": url,
            "title": title,
            "matches": matches,
        }

async def crawl_multiple_domains(domains: List[str], keywords: List[str], max_depth: int, max_pages: int):
    start_time = time.time()
    results = []
    for domain in domains:
        result = await crawl_single_page(domain, keywords)
        results.append(result)
    duration = round(time.time() - start_time, 2)
    return {"duration": duration, "results": results}
