// https://repl.it/CbDR/1
import java.util.Arrays;

/**
 * 让目前队头的人依次与其后的每个人进行比较，比较后较矮的那个人继续与后面的人进行比较，这样第一趟比较下来，就能够找到最矮的人，
 * 然后把这个最矮的人和当前队头的人交换一下位置。然后第二趟比较，让第二名依次与后面比较，可以找到第二矮的人，
 * 然后让第二矮的人和当前队列第二名交换位置，依此类推

 * 选择排序的交换次数比冒泡排序要小,介于0 ~ n-1之间,它的唯一优点就是原地操作.
 * 和冒泡排序一样,它的平均时间复杂度为O(n²)
 */
public class SelectionSort {
  public static void sort(int[] items) {
    for (int i = 0; i < items.length - 1; i += 1) {
      int minIndex = i;
      for (int j = i + 1; j < items.length; j += 1) {
        if (items[j] < items[minIndex]) {
          minIndex = j;
        }
      }

      exchange(items, i, minIndex);
    }
  }

  public static void exchange(int[] a, int i, int j) {
    int temp = a[i];
    a[i] = a[j];
    a[j] = temp;
    System.out.println("Switch " + i + " to " + j);
    System.out.println("Current Order: " + Arrays.toString(a));
    System.out.println("====");
  }

  public static void main(String[] args) {
    int[] items = {5,3,7,4,2,1};
    sort(items);
    System.out.println(items);
  }
}
