def shell_sort(arr):
    n = len(arr)
    step = n // 2

    while step > 0:
        for i in range(step, n):
            temp = arr[i]
            j = i

            while j >= step and arr[j - step] > temp:
                arr[j] = arr[j - step]
                j -= step
            arr[j] = temp
        step //= 2

    return arr


def quick_sort(arr):
    if len(arr) <= 1:
        return arr

    pivot = arr[len(arr) // 2]  # выбираем средний элемент как опорный
    left = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]

    return quick_sort(left) + middle + quick_sort(right)