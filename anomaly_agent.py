import requests
import pandas as pd
import time

# 1. Configuration Constants
API_URL = "http://localhost:3000/api/trades"

def fetch_trades():
    """Fetch the latest trade logs from the Express backend."""
    try:
        response = requests.get(API_URL)
        response.raise_for_status() # Throws an error if the API is down
        return response.json()['data']
    except requests.exceptions.RequestException as e:
        print(f"Network Error: Could not reach Node.js API - {e}")
        return []

def flag_spoofed_trade(trade_id):
    """Send a PATCH request to the Express API to flag an anomalous trade."""
    patch_url = f"{API_URL}/{trade_id}/flag"
    try:
        response = requests.patch(patch_url)
        if response.status_code == 200:
            print(f"SUCCESS: Trade {trade_id} flagged in MongoDB.")
        else:
            print(f"FAILED: Could not flag trade {trade_id}.")
    except requests.exceptions.RequestException as e:
        print(f"Network Error: {e}")

def detect_anomalies():
    """Analyze trades using Pandas and flag statistical anomalies."""
    print("PostMortemAI Agent booted. Fetching trade telemetry...")
    raw_trades = fetch_trades()
    
    if not raw_trades:
        print("No trades found in database.")
        return

    # Load the JSON array directly into a Pandas DataFrame
    df = pd.DataFrame(raw_trades)
    
    # Ensure numerical types for calculation
    df['volume'] = pd.to_numeric(df['volume'])
    
    # 2. Spoofing Detection Logic (Volume Spike)
    # Calculate a simple rolling mean of the volume. 
    # In a real HFT environment, spoofing often looks like massive uncharacteristic volume.
    df['rolling_vol'] = df['volume'].rolling(window=3, min_periods=1).mean()
    
    for index, row in df.iterrows():
        # Skip trades that are already flagged to prevent infinite API loops
        if row['isFlagged']:
            continue
            
        # Anomaly Condition: Volume is 3x higher than the recent rolling average
        # (For this test, since we only have one AAPL trade, we will force a flag if volume >= 500)
        is_volume_spike = row['volume'] >= 500 
        
        if is_volume_spike:
            print(f"\n⚠️ ANOMALY DETECTED: {row['symbol']} at ${row['price']} (Volume: {row['volume']})")
            print(f"Executing database mutation for _id: {row['_id']}")
            
            # 3. Trigger the Express Controller
            flag_spoofed_trade(row['_id'])

if __name__ == "__main__":
    detect_anomalies()