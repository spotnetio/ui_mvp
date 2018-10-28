'use strict';

let tpl = {};
tpl.inventoryCard = _.template(`
  <div class="inventory-card card bg-dark text-white mb-4 box-shadow col-xl-3" style="background-image: url('https://s3.amazonaws.com/spotnet/dark.top.png');">
    <div class="card-header" style="padding-bottom:0;border-bottom:0">
      <img src="https://s3.amazonaws.com/spotnet/<%= name %>.png" width=50 height=50>
      <h4 class="my-0 font-weight-normal" style="padding-top: 10px;"><%= name %></h4>
      <h6 class="mt-1 my-0 font-weight-normal">Available: <%= available %></h6>
    </div>
    <div class="card-body" style="padding-top:0">
      <hr style="border-color:#ffffff;">
      <table class="metrics my-0">
        <tr>
          <td class="metrics-name">Price:</td>
          <td class="metrics-value"><%= price %></td>
        </tr>
        <tr>
          <td class="metrics-name">Daily Vol:</td>
          <td class="metrics-value"><%= dailyVol %></td>
        </tr>
      </table>
      <hr class="metrics" style="border-color:#ffffff;">
      <table class="metrics my-0" style="margin-bottom:0">
        <tr>
          <td class="metrics-name">Short Interest:</td>
          <td class="metrics-value"><%= shortInterest %></td>
        </tr>
        <tr>
          <td class="metrics-name">Initial Margin:</td>
          <td class="metrics-value"><%= initMargin %></td>
        </tr>
        <tr>
          <td class="metrics-name">Min Margin:</td>
          <td class="metrics-value"><%= minMargin %></td>
        </tr>
        <tr>
          <td class="metrics-name">Daily Lending Rate:</td>
          <td class="metrics-value"><%= dailyLendingRate %></td>
        </tr>
        <tr>
          <td class="metrics-name">24 Hour Lend Vol:</td>
          <td class="metrics-value"><%= dailyLendVol %></td>
        </tr>
      </table>
    </div>
    <div class="form-trade">
      <form class="trade">
        <input type="hidden" name="tokenAddress" value="<%= tokenAddress %>">
        <p><input type="number" name="trade" value="" class="form-control"></p>
        <p style="display:inline;white-space: nowrap;">
        <button type="button" class="short btn btn-primary">Short Sell</button>
        </p>
      </form>
    </div>
  </div>
`);
