# import os
# import sys
# import numpy as np
# import pandas as pd
# from PIL import Image
# import base64

# files = []
# for filename in os.listdir("./docs/data/concast/image"):
#     if filename.endswith(".jpg"):
#         with open(f"./docs/data/concast/image/{filename}", "rb") as f:
#             files.append(base64.b64encode(f.read()).decode("utf-8"))


# df = pd.DataFrame(files)
# df.to_json(sys.stdout, orient="records")
