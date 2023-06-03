import argparse
from matplotlib import pyplot as plt
import numpy as np


parser = argparse.ArgumentParser(description="Process command-line image path.")
parser.add_argument("file_path", metavar="file_path", type=str, nargs="?", \
                    default="image.png", help="image file path for processing")



def main(args):
    pass


if __name__=='__main__':
    args = parser.parse_args()
    main(args)
    