import java.util.Arrays;

/**
 * 插入排序（英语：Insertion Sort）是一种简单直观的排序算法。
 * 它的工作原理是通过构建有序序列，对于未排序数据，在已排序序列中从后向前扫描，找到相应位置并插入。
 * 插入排序在实现上，通常采用in-place排序（即只需用到O(1)的额外空间的排序），
 * 因而在从后向前扫描过程中，需要反复把已排序元素逐步向后挪位，为最新元素提供插入空间。

 * NOTE 在对要插入的元素进行排序时,之前的元素总是已经被构建为有序序列,所以可以在比较过程中通过二分查找法来减少比较次数
 * 插入排序平均时间复杂度为O(n²),适合数据量不大以及部分有序的序列进行排序
 */
public class InsertionSort {
  public static void sort(int[] items) {
    for (int i = 1; i < items.length; i += 1) {
      int target = items[i];
      // 从后向前扫描,如果待比较元素大于当前元素,将比较元素后移;将当前元素前移
      for (int j = i - 1; j >= 0; j -= 1) {
        if (items[j] > target) {
          items[j + 1] = items[j];
          items[j] = target;
          System.out.println("Current Order: " + Arrays.toString(items));
        }
      }
    }
  }

  public static void main(String[] args) {
    int[] items = {5,3,7,4,2,1};
    sort(items);
    System.out.println(Arrays.toString(items));
  }
}
