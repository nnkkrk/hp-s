export function generateUserId(name, phone) {
  const part1 = name.substring(0, 3).toUpperCase();
  const part2 = phone.slice(-4);
  const part3 = Math.random().toString(36).substring(2, 6).toUpperCase();

  return `${part1}-${part2}-${part3}`;
}
