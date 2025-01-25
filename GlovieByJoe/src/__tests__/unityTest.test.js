function sum(a, b) {
    return a + b;
}
//
// aqui é só um teste basico que fiz para testar uma função
//
test('teste unitário para validar uma função básica', () => {
    expect(sum(2, 3)).toBe(5);
});