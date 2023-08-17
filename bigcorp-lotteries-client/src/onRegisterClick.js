export async function onRegisterClick() {
    const nameInput = document.getElementById("name");
    const checkboxes = Array.from(
      document.querySelectorAll("input[type=checkbox]")
    );
  
    const currName = nameInput.value;
    const isAnyChecked = checkboxes.some((checkbox) => checkbox.checked);
  
        //     const response = await fetch("http://localhost:3000/register", {
    //         method: "POST",
    //         headers: {
    //           "Content-Type": "application/json",
    //         },
    //         body: JSON.stringify({
    //           name,
    //           lotteries: checkboxes
    //             .filter((checkbox) => checkbox.checked)
    //             .map((checkbox) => checkbox.id),
    //         }),
    //       });
    //       const data = await response.json();
    //       console.log(data);
    //       checkboxes.forEach((checkbox) => (checkbox.checked = false));
    //       nameInput.value = "";
    //     }
    // if (currName && isAnyChecked) {
    //   try {
    //     await Promise.all(
    //       checkboxes
    //         .filter((checkbox) => checkbox.checked)
    //         .map((checkbox) =>
    //           fetch("http://localhost:5173/register", {
    //             headers: {
    //               Accept: "application/json",
    //               "Content-Type": "application/json",
    //             },
    //             method: "POST",
    //             body: JSON.stringify({
    //               lotteryId: checkbox.id,
    //               name: currName,
    //             }),
    //           })
    //         )
    //     );
    if (currName && isAnyChecked) {
      try {
        await Promise.all(
          checkboxes
            .filter((checkbox) => checkbox.checked)
            .map((checkbox) =>
              fetch(`${import.meta.env.VITE_API_URL}/register`, {
                headers: {
                  Accept: "application/json",
                  "Content-Type": "application/json",
                },
                method: "POST",
                body: JSON.stringify({
                  lotteryId: checkbox.id,
                  name: currName,
                }),
              })
            )
        );
        nameInput.value = "";
        alert(`Successfully registered ${currName} for the selected lotteries!`);
      } catch (e) {
        console.error("Error registering for lotteries");
      }
    }
  }