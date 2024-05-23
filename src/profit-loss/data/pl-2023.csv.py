import os
import sys
import pandas as pd

# Load the data
files = []

for l in ["j1", "j2", "j3"]:
    files.append(pd.read_csv(os.path.join(sys.path[0], f"./pl-2023-{l}.csv")).T)

df = pd.concat(files)
df.to_csv(sys.stdout, index=False)
