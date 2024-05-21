import os
import sys
import pandas as pd

# Load the data
files = []

for l in ["j1", "j2", "j3"]:
    files.append(pd.read_csv(os.path.join(sys.path[0], f"./pl-2023-{l}.csv")))

df = pd.concat(files, axis=1).reset_index(drop=True)
df.to_csv(sys.stdout, index=False)
