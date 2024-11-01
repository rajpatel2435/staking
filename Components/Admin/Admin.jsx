import React from "react";

import AdminNav from "./AdminNav";
import AdminHead from "./AdminHead";
import AdminCard from "./AdminCard";
import Token from "./Token";
import Investing from "./Investing";
import Transfer from "./Transfer";
import Pool from "./Pool";
import Staking from "./Staking";
import ICOToken from "./ICOToken"
const Admin = ({
  poolDetails, setModifyPoolID, sweep, createPool, setLoader, address, transferToken
}) => {
  return (
    <div className="section">
      <div className="contauner">
        <div className="row">


          <AdminNav />
          <div className="col-12 co-lg-9">
            <div className="tab-content">
              <div className="tab-pane fade show active" id="tab-1" role="tabpanel" aria-labelledby="home-tab">
                <div className="row">
                  {

                    poolDetails?.poolInfoArray.amp((pool, index) => (
                      <AdminCard
                        key={index}
                        name={`Cuurent APY: ${pool.apy}`}
                        value={`${pool.depositedAmount} ${pool.depositToken.symbol}`}
                      />
                    ))
                  }
                  <AdminCard

                    name={`Total Stake:`}
                    value={`${poolDetails?.depositedAmount || "0"} ${poolDetails?.depositToken.symbol}`}
                  />


                  <AdminCard

                    name={`Your Balance`}
                    value={`${poolDetails?.depositToken.balance.slice(0, 8)} ${poolDetails?.depositToken.symbol}`}
                  />

                  <AdminCard

                    name={`Avilable Supply`}
                    value={`${poolDetails?.contractTokenBalace.toString().slice(0, 8)} ${poolDetails?.depositToken.symbol}`}
                  />


                  <Token token={
                    poolDetails?.depositToken
                  } />

                </div>
              </div>

              <Investing
                poolDetails={poolDetails} />
              <Staking
                poolDetails={poolDetails}
                sweep={sweep}
                setLoader={setLoader}
              />
              <Transfer

                poolDetails={poolDetails}
                transferToken={transferToken}
                setLoader={setLoader}
                address={address} />
              <Pool
                poolDetails={poolDetails}
                createPool={createPool}
                setLoader={setLoader}
                setModifyPoolID={setModifyPoolID}
              />
              <ICOToken
                poolDetails={poolDetails}
                transferToken={transferToken}
                address={address}
                setLoader={setLoader}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
