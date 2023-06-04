import argparse
from matplotlib import pyplot as plt
import numpy as np


parser = argparse.ArgumentParser(description="Process command-line image path.")
parser.add_argument("file_path", metavar="file_path", type=str, nargs="?", \
                    default="image.png", help="image file path for processing")



def main(args):
    src_img = plt.imread(args.file_path)
    height = src_img.shape[0]
    width = src_img.shape[1]
    # convert rgba to rgb
    src_data = np.zeros((height, width, 3))
    if src_img.shape[2] == 4:
        src_data[:,:,0] = src_img[:,:,0] * src_img[:,:,3]
        src_data[:,:,1] = src_img[:,:,1] * src_img[:,:,3]
        src_data[:,:,2] = src_img[:,:,2] * src_img[:,:,3]
    else:
        src_data = src_img
    # convert rgb to grayscale color
    gray_img = np.ndarray.astype((src_data[:,:,0] + src_data[:,:,1] + src_data[:,:,2]) * 255 /3, dtype=np.uint8)
    plt.imsave("gray_img.png", gray_img, cmap="gray")

    # create color histogram
    color_hist = [0 for i in range(256)]
    for g_code in gray_img.flatten():
        color_hist[g_code] += 1
    print(color_hist[100])
    plt.hist(gray_img.flatten().tolist(), list(range(256)))
    plt.savefig("b_norm_color_hist.png")
    

if __name__=='__main__':
    args = parser.parse_args()
    main(args)
    