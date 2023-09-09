export async function onRegisterClick(): Promise<void> {
  const nameInput = document.getElementById('name') as HTMLInputElement;
  const checkboxes = Array.from(
    document.querySelectorAll(
      'input[type=checkbox]',
    ) as NodeListOf<HTMLInputElement>,
  );

  if (!nameInput) {
    return;
  }

  const currName = nameInput.value;
  const isAnyChecked = checkboxes.some((checkbox) => checkbox.checked);

  if (currName && isAnyChecked) {
    try {
      await Promise.all(
        checkboxes
          .filter((checkbox) => checkbox.checked)
          .map((checkbox) =>
            fetch(`${import.meta.env.VITE_API_URL}/register`, {
              headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
              },
              method: 'POST',
              body: JSON.stringify({
                lotteryId: checkbox.id,
                name: currName,
              }),
            }),
          ),
      );

      nameInput.value = '';
      alert(`Successfully registered ${currName} for the selected lotteries!`);
    } catch (e) {
      console.error('Error registering for lotteries');
    }
  }
}
