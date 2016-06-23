/**
 * 在线体验地址
 * https://repl.it/C5OT/1
 */
import java.util.*;
import java.lang.*;

public class BitSetDemo {

  public static void main(String args[]) {
    int len = 16;
    BitSet bits1 = new BitSet(len);
    BitSet bits2 = new BitSet(len);

    for (int i = 0; i < len; i += 1) {
      if ((i%2) == 0) {
        bits1.set(i);
      }
      if ((i%5) != 0) {
        bits2.set(i);
      }
    }

    System.out.println("BitSet.size()表示实际使用的存储空间");
    System.out.println(bits1.size());
    System.out.println(bits2.size());

    System.out.println("BitSet.length()表示逻辑大小，最高设置位的索引加1，不一定是16");
    System.out.println(bits1.length());
    System.out.println(bits2.length());

    System.out.println("BitSet.toString返回字符串表示形式，依次表示为真的索引");
    System.out.println(bits1.toString());
    System.out.println(bits2.toString());

    System.out.println("BitSet.and执行逻辑与操作，会改变当前BitSet");
    BitSet bits3 = immutableAnd(bits2, bits1);
    System.out.println(bits1);
    System.out.println(bits2);
    System.out.println(bits3);

    System.out.println("BitSet转换为二进制表示");
    System.out.println(toString(bits1, 16));
    System.out.println(toString(bits2, 16));

    System.out.println(toString(convertIPAsBitSet("192.168.0.1"), 32));
  }

  public static String toString(BitSet bs, int len) {
    StringBuilder sb = new StringBuilder(bs.length());
    for (int i = 0; i < len; i += 1) {
      sb.append(bs.get(i) ? "1" : "0");
    }

    return sb.toString();
  }

  public static BitSet immutableAnd(BitSet bs1, BitSet bs2) {
    BitSet cloned = (BitSet)bs1.clone();
    cloned.and(bs2);
    return cloned;
  }

  /**
   * 将IP地址使用BitSet存储
   */
  public static BitSet convertIPAsBitSet(String ip) {
    String[] items = ip.split("\\.");
    byte fragLen = (byte)items.length;
    byte len = (byte)(fragLen * 8);
    BitSet bs = new BitSet(len);
    for (byte i = 0; i < fragLen; i += 1) {
      int num = Integer.parseInt(items[i]);
      if (num > 255) {
        throw new RuntimeException("IP格式错误");
      }
      // toBinaryString按自然位置返回的顺序，需要调整
      String binaryFormat = new StringBuilder(Integer.toBinaryString(num)).reverse().toString();
      for (byte j = 0; j < binaryFormat.length(); j += 1) {
        if (binaryFormat.charAt(j) == '1') {
          bs.set((fragLen - i - 1) * 8 + j);
        }
      }
    }

    return bs;
  }
}
