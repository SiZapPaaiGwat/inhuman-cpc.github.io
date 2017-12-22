import java.util.Arrays;

/**
 * 希尔排序，也称递减增量排序算法，是插入排序的一种更高效的改进版本。希尔排序是非稳定排序算法
 * 按步长分割数组,然后纵向对每一列进行插入排序.我
 * 步长的选取对希尔排序的性能也有影响

 * 以 5, 3, 7, 4, 2, 1, 10, 6, 20, 8, 9, 13 为例，选定步长=4
 * 5 3 7 4
 * 2 1 10 6
 * 20 8 9 13
 * 然后从步长起点元素开始遍历对每一列（５，２，１０），（３，１，８）...进行插入排序，直到数组结束．
 * 最后再缩短步长重复上述动作，直到步长＝１．
 */
public class ShellSort {
  public static final int K = 3;

  public static int getGapNumber(int len) {
    int gap = 1;
    // <O(n^(3/2)) by Knuth,1973>: 1, 4, 13, 40, 121, ...
    while (gap < len / K) {
      gap = gap * K + 1;
    }

    System.out.println("Gap number is " + gap);

    return gap;
  }

  public static void sort(int[] arr) {
  	int len = arr.length;

  	for (int gap = getGapNumber(len); gap > 0; gap /= K) {
      for (int i = gap; i < len; i += 1) {
        int target = arr[i];
        // 标记本轮循环是否有元素挪动
        Boolean isMoved = false;
        int j;
        // 从后向前执行插入排序,将大号元素向后挪动
        for (j = i - gap; j >= 0 && arr[j] > target; j -= gap) {
          isMoved = true;
          arr[j + gap] = arr[j];
        }
        // 如果前部分有序序列有挪动,则将最低位挪动的元素置换位当前元素
        // NOTE isMoved为了理解上更方便加进来,其实不需要.
        if (isMoved) {
          arr[j + gap] = target;
        }
      }
    }
  }

  public static void main(String[] args) {
    int[] items = {5, 3, 7, 4, 2, 1, 10, 6, 20, 8, 9, 13};
    sort(items);
    System.out.println(Arrays.toString(items));
  }
}
