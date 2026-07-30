export function createBookingHoldGuard() {
  let generation = 0;
  let preparing = false;

  return {
    begin() {
      generation += 1;
      preparing = true;
      return generation;
    },
    invalidate() {
      generation += 1;
      preparing = false;
    },
    complete(operation) {
      if (generation === operation) preparing = false;
    },
    isCurrent(operation) {
      return generation === operation;
    },
    isPreparing() {
      return preparing;
    },
  };
}
