import React from "react";

import { MdAdminPanelSettings } from "/Components/ReactICON/index";

const ADDRESS_EXPLORER = process.env.NEXT_PBLIC_ADDRESS_EXPLORER;
const STAKING_DAPP = process.env.NEXT_PBLIC_STAKING_DAPP;
const TOKEN_EXPLORER = process.env.NEXT_PBLIC_TOKEN_EXPLORER;
const TOKEN = process.env.NEXT_PBLI_DEPOSIT_TOKEN;
console.log(TOKEN);
console.log(STAKING_DAPP);
const Token = ({ token }) => {
  return (

    <div className="col-12">
      <div className="invest invest--big">
        <h2 className="invest__title">Block Explorer</h2>
        <div className="invest__group">
          <input type="text" id="partnerlink" name="partnerlink" className="form__input" defaultValue={`${ADDRESS_EXPLORER}${STAKING_DAPP}`} />
          <p> Stake Token Stats Crypto king</p>

          <table className="invest__table">
            <thead>
              <tr>
                <th>token</th>
                <th>value</th>
              </tr>
            </thead>

            <tbody>
              <tr
              >
                <td> name </td>
                <td> {token?.name}</td></tr>

              <tr>
                <td> value </td>
                <td> {token?.symbol}</td>
              </tr>

              <tr>
                <td> Total Supply </td>
                <td> {token?.totalSupply} {token?.symbol}</td>
              </tr>

              <tr>
                <td> Total Stake </td>
                <td> {token?.contractTokenBalance || 0} {token?.symbol}</td>
              </tr>

              <tr>
                <td className="yellow"> Explorer Token </td>
                <td> <a href={`${TOKEN_EXPLORER}${TOKEN}`}> 
                  <i className="ti"><MdAdminPanelSettings /></i> 
                  <span>{ token?.name }</span></a>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default Token;
