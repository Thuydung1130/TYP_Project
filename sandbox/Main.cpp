#include <iostream>
#include <vector>
#include <limits>
using namespace std;

int main() {
    int n;
    
    cin >> n;

    if (n <= 0) {
        cout << "ERROR: So luong phan tu phai > 0" << endl;
        return 0;
    }

    vector<int> arr(n);
    
    for (int i = 0; i < n; i++) {
        cin >> arr[i];
    }

    int maxVal = numeric_limits<int>::min();
    for (int i = 0; i < n; i++) {
        if (arr[i] > maxVal) maxVal = arr[i];
    }

    cout  << maxVal << endl;

    return 0;
}

