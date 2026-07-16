# Scaleway Generative APIs

This app calls Scaleway through the OpenAI-compatible Chat Completions API.

## Defaults

| Setting | Value |
| --- | --- |
| Base URL | `https://api.scaleway.ai/ee9e975c-6021-45f0-ad87-e565cadbf5f3/v1` |
| Model | `glm-5.2` |
| Max tokens | `16384` |
| Temperature | `1` |
| Top P | `0.95` |
| Presence penalty | `0` |
| Stream | enabled by eve |
| Response format | `{ "type": "text" }` |

## Environment

Set your Scaleway IAM secret key:

```bash
SCW_SECRET_KEY=scw_...
```

Optional overrides:

```bash
EVE_MODEL_BASE_URL=https://api.scaleway.ai/ee9e975c-6021-45f0-ad87-e565cadbf5f3/v1
EVE_MODEL_ID=glm-5.2
```

`SCALEWAY_API_KEY` and `EVE_MODEL_API_KEY` are accepted as fallbacks for the secret key.

## Equivalent Python client

```python
from openai import OpenAI

client = OpenAI(
    base_url="https://api.scaleway.ai/ee9e975c-6021-45f0-ad87-e565cadbf5f3/v1",
    api_key="SCW_SECRET_KEY",
)

response = client.chat.completions.create(
    model="glm-5.2",
    messages=[{"role": "user", "content": "Hello"}],
    max_tokens=16384,
    temperature=1,
    top_p=0.95,
    presence_penalty=0,
    stream=True,
    response_format={"type": "text"},
)

for chunk in response:
    if chunk.choices and chunk.choices[0].delta.content:
        print(chunk.choices[0].delta.content, end="", flush=True)
```

Wiring lives in `agent/agent.ts` via `@ai-sdk/openai-compatible`.
