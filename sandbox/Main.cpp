#include <iostream>
using namespace std;

// Hàm tính giai th?a
unsigned long long factorial(int n) {
    unsigned long long res = 1;
    for (int i = 2; i <= n; i++) {
        res *= i;
    }
    return res;
}

int main() {
    int n;
    
    cin >> n;

    if (n < 0) {
        cout << "ERROR: Giai thua khong dinh nghia cho so am!" << endl;
    } else {
        cout <<  factorial(n) << endl;
    }

    return 0;
}

