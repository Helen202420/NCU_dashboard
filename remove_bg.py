from PIL import Image
import sys

def remove_white_bg(img_path):
    try:
        img = Image.open(img_path)
        img = img.convert("RGBA")
        datas = img.getdata()

        newData = []
        for item in datas:
            # item is (R, G, B, A)
            if item[0] > 220 and item[1] > 220 and item[2] > 220:
                # replacing white with transparent
                newData.append((255, 255, 255, 0))
            else:
                newData.append(item)

        img.putdata(newData)
        img.save(img_path, "PNG")
        print("Success")
    except ImportError:
        print("Pillow not installed")
        sys.exit(1)
    except Exception as e:
        print("Error:", e)

remove_white_bg("public/robot.png")
