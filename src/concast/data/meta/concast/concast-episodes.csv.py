import sys
import glob
import json
import pandas as pd


def split_number(number):
    split = number.split("-")
    if len(split) == 1:
        return split[0], None
    return split[0], split[1]


# files = []
# # TODO: use sys.~~~
# for filename in glob.glob("./src/data/concast/meta/concast/*.json"):
#     with open(filename, "r") as f:
#         files.append(json.load(f))

# df = pd.DataFrame(files)
# df["main-number"] = df["Number"].apply(lambda x: int(split_number(x)[0]))
# df["sub-number"] = df["Number"].apply(lambda x: split_number(x)[1])
# df = df.sort_values(by="main-number", ascending=True)
# df = df.reset_index(drop=True)
# df.to_json(sys.stdout, orient="records")
