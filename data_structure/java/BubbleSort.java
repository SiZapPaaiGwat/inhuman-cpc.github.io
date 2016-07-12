// https://repl.it/CbC9
import java.util.Arrays;

/**
 * 假如我们现在按身高升序排队，一种排队的方法是：
 * 从第一名开始，让两人相互比身高，若前者高则交换位置，更高的那个在与剩下的人比，这样一趟下来之后最高的人就站到了队尾。
 * 接着重复以上过程，直到最矮的人站在了队列首部。
 * 我们把队头看作水底，队尾看作水面，那么第一趟比较下来，最高的人就像泡泡一样从水底”冒“到水面，
 * 第二趟比较则是第二高的人
 */
public class BubbleSort {
  public static void sort(int[] items) {
    for (int i = 0; i < items.length - 1; i += 1) {
      for (int j = 0; j < items.length -1; j += 1) {
        if (items[j] > items[j + 1]) {
          exchange(items, j, j + 1);
        }
      }
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
    int[] items = {5,4,3,2,1};
    sort(items);
    System.out.println(items);
  }
}
