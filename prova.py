import requests
import openai

# Sostituisci '[api-key]' con la tua chiave API
api_key = ''

# URL del servizio GraphQL
url = f'https://api.thegraph.com/subgraphs/name/ensdomains/ens'

with open("backend/app/graphql/ens.root.object", "r") as f:
    q_roots = f.read()

with open("backend/app/graphql/ens.graphql", "r") as f:
    txt = f.read()

# print(txt)

# Funzione per generare la query GraphQL utilizzando GPT-3.5
def generate_graphql_query(p):
    prompt=f"""
Given the following graphql schema:
```
{txt}
```
    
Translate the following into a syntactically valid graphql query.
Try to not invent new fields, but use the ones already defined in the schema.
Prefer less precise results over probably failing queries.
Give me only the query source.
    
```
${p}
```
"""
    print(prompt)
    response = openai.Completion.create(
        model="gpt-3.5-turbo-instruct",
        # engine="davinci-002",
        prompt=prompt,
        max_tokens=200
    )
    return response.choices[0].text.strip().replace("`", "").strip()

# Prompt per generare la query GraphQL
prompt = "Give me the first 3 domains"
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
    exit(1)


prompt = f"""
Translate into human readable terms the following graphql query response:
```       
{response.text}
```
"""

print(prompt)

f = openai.Completion.create(
        model="gpt-3.5-turbo-instruct",
        prompt=prompt,
        max_tokens=200
    )

print(f)

print(f.choices[0].text)
