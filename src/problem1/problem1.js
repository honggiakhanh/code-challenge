const sum_to_n_a = (n) => {
    var sum = 0;
    for (var i = 1; i <= n; i++) {
        sum += i;
    }
    return sum;
};

const sum_to_n_b = (n) => {
    return (n * (n + 1)) / 2;
};

const sum_to_n_c = (n) => {
    if (n <= 0) {
        return 0;
    }
    return n + sum_to_n_c(n - 1);
};

console.log(sum_to_n_a(10));
console.log(sum_to_n_b(10));
console.log(sum_to_n_c(10));