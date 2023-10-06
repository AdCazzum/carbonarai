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
def generate_graphql_query(prompt):
    response = openai.Completion.create(
        engine="davinci-002",
        prompt=f"""
            Given the following graphql schema:
            ```
            {txt}
            ```

            Translate the following into a syntactically valid graphql query. Give me only the query source.

            ```
            Give me the id of the domain named taoli.eth
            ```
        """,
        max_tokens=200
    )
    return response.choices[0].text.strip()

# Prompt per generare la query GraphQL
prompt = "get the first 5 id, name of the Domains"
query = generate_graphql_query(prompt)

print("------------------")
print(query)
print("------------------")

# Parametri della richiesta GraphQL
variables = {}

# Creazione della richiesta POST
response = requests.post(url, json={'query': query, 'variables': variables})

# Verifica della risposta
if response.status_code == 200:
    data = response.json()
    print(data)
else:
    print(f'Errore nella richiesta GraphQL: {response.status_code}')
    print(response.text)
