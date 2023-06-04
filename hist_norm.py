import argparse
from matplotlib import pyplot as plt
import numpy as np


parser = argparse.ArgumentParser(description="Process command-line image path.")
parser.add_argument("file_path", metavar="file_path", type=str, nargs="?", \
                    default="image.png", help="image file path for processing")



def main(args):
    # step 1
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
    # plt.imsave("gray_img.png", gray_img, cmap="gray")

    # step2: create color histogram
    color_hist = [0 for i in range(256)]
    for g_code in gray_img.flatten():
        color_hist[g_code] += 1
    # plt.hist(gray_img.flatten().tolist(), list(range(256)))
    # plt.savefig("b_norm_color_hist.png")

    # step 3: do accumulative sum
    cumulative_sum = color_hist.copy()
    for i in range(1, len(cumulative_sum), 1):
        cumulative_sum[i] += cumulative_sum[i - 1]
    assert cumulative_sum[255] == width * height
    # plt.stairs(cumulative_sum, list(range(257)))
    # plt.savefig("cumulative_sum.png")
    
    # step 4: do mapping
    color_levels = 256
    num_pixels = width * height
    new_colors = [round((color_levels - 1) * x / num_pixels) for x in cumulative_sum]

    # step 5: create new picture
    new_picture = np.zeros(gray_img.shape)
    for x in range(height):
        for y in range(width):
            new_picture[x,y] = new_colors[gray_img[x, y]]
    plt.imsave(f"norm_gray_img.png", new_picture, cmap="gray")


if __name__=='__main__':
    args = parser.parse_args()
    main(args)
    