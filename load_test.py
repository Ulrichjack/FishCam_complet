# ─── load_test.py ───────────────────────────
import requests
import threading
import time

# L'adresse de ton vieux PC
BASE_URL = "http://192.168.8.101/api/v1"

# ⚠️ COLLE TON TOKEN JWT ICI (sans le mot "Bearer ")
TOKEN = "eyJhbGciOiJIUzI1NiJ9.eyJmaXJzdE5hbWUiOiJTdXBlciIsImxhc3ROYW1lIjoiQWRtaW4iLCJwb2lzc29ubmVyaWVJZCI6MSwicm9sZSI6IlNVUEVSX0FETUlOIiwicGhvbmUiOiI2OTIwODc3MjQiLCJ1c2VySWQiOjEsInN1YiI6IjY5MjA4NzcyNCIsImlhdCI6MTc4MTg5NzIxNCwiZXhwIjoxNzgxOTgzNjE0fQ.T5w30-LB0vMEQzt2k8TP3sj0Pal4VaazFhDjmKZ3sTo" 

# Compteurs pour les statistiques
success_count = 0
error_count = 0
lock = threading.Lock()

def create_facture(thread_id):
    global success_count, error_count
    headers = {"Authorization": f"Bearer {TOKEN}"}
    
    # On crée une facture pour la poissonnerie 1 et le fournisseur 1
    payload = {
        "poissonnerieId": 1,
        "fournisseurId": 1,
        "dateAchat": "2026-06-19"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/factures", json=payload, headers=headers)
        with lock:
            if response.status_code == 201:
                success_count += 1
            else:
                error_count += 1
                print(f"Thread {thread_id}: Erreur {response.status_code} - {response.text}")
    except Exception as e:
        with lock:
            error_count += 1
            print(f"Thread {thread_id}: Exception - {e}")

print("🚀 Démarrage de l'attaque : 500 requêtes simultanées...")
start_time = time.time()

threads = []
# On lance 500 requêtes
for i in range(500):
    t = threading.Thread(target=create_facture, args=(i,))
    threads.append(t)
    t.start()
    time.sleep(0.02) # Petite pause de 20ms pour ne pas faire crasher ton propre PC de dev !

# On attend que toutes les requêtes soient terminées
for t in threads:
    t.join()

end_time = time.time()
print("\n" + "="*40)
print(f"✅ TEST TERMINÉ EN {end_time - start_time:.2f} SECONDES")
print(f"🟢 Succès (201 Created) : {success_count}")
print(f"🔴 Erreurs : {error_count}")
print("="*40)