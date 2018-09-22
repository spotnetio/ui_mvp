$(() => {
  $('#deposit').on('click', () => {
    console.log(`you want to deposit ${$('#transfer-amount').val()}`);
  });
  $('#withdraw').on('click', () => {
    console.log(`you want to withdraw ${$('#transfer-amount').val()}`);
  });
});
