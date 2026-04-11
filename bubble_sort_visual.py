import random
import time


def bubble_sort_visual(arr, delay=0.1):
    """
    Bubble sort with ASCII bar visualization.
    Shows bars made of █ characters, highlights comparisons in red.
    """
    n = len(arr)
    arr = arr.copy()

    def clear_screen():
        print("\033[H\033[J", end="")

    def draw_bars(data, compare_idx=None):
        max_val = max(data)
        bars = []
        for i, val in enumerate(data):
            bar_len = int((val / max_val) * 40)  # Scale to 40 chars max
            bar = "█" * bar_len
            if compare_idx and i in compare_idx:
                bar = f"\033[91m{bar}\033[0m"  # Red for comparing
            bars.append(f"{val:3d}: {bar}")
        return "\n".join(bars)

    print("Initial array:")
    print(draw_bars(arr))
    time.sleep(delay * 2)

    for i in range(n):
        swapped = False
        for j in range(0, n - i - 1):
            clear_screen()
            print(f"Pass {i+1}/{n}, comparing indices {j} and {j+1}")
            print(draw_bars(arr, compare_idx=[j, j + 1]))
            time.sleep(delay)

            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
                swapped = True
                clear_screen()
                print(f"Pass {i+1}/{n}, SWAP! {arr[j+1]} ↔ {arr[j]}")
                print(draw_bars(arr, compare_idx=[j, j + 1]))
                time.sleep(delay)

        if not swapped:
            break

    clear_screen()
    print("✓ SORTED!")
    print(draw_bars(arr))
    return arr


if __name__ == "__main__":
    # Generate random data
    data = [random.randint(10, 99) for _ in range(15)]

    print("Bubble Sort Visualization")
    print("=" * 50)
    print(f"Sorting: {data}")
    print("=" * 50)
    time.sleep(1)

    sorted_data = bubble_sort_visual(data, delay=0.15)

    print("\nFinal sorted array:", sorted_data)
