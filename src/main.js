$(() => {
  const $buyToCoverModal = $('#buy-to-cover-modal');

  $('#deposit').on('click', function() {
    console.log(`you want to deposit ${$('#transfer-amount').val()}`);
  });
  $('#withdraw').on('click', function() {
    console.log(`you want to withdraw ${$('#transfer-amount').val()}`);
  });

  $('.buy-to-cover').on('click', function() {    
    const tradePrice = $(this).data('trade-price');
    const shareCount = $(this).data('shares');
    const ticker = $(this).data('ticker');

    $buyToCoverModal.find('.modal-title').text(`Buy to Cover ${shareCount} EOS @ $${tradePrice} to close`);

    $buyToCoverModal.find('.trading-value').text((shareCount * tradePrice).toFixed(2));
    $buyToCoverModal.find('.buying-power').text(`$${906.54}`);
    
    $buyToCoverModal.find('input[name="trade_price"]').val(tradePrice);
    $buyToCoverModal.find('input[name="shares"]').val(tradePrice);
    $buyToCoverModal.find('input[name="ticker"]').val(ticker);
  });

  $('#buy-to-cover-confirmation-modal').on('show.bs.modal', function() {
    $buyToCoverModal.modal('hide');
    const shareCount = $buyToCoverModal.find('input[name="shares"]').val();
    const ticker = $buyToCoverModal.find('input[name="ticker"]').val();
    $('#buy-to-cover-confirmation-modal .transaction').text(`Buy to cover ${shareCount} ${ticker}`);
    $('#buy-to-cover-confirmation-modal .transaction-link').html($('<a href="#">Transaction Link</a>'));
  });
});
