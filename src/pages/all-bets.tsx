import React, { useEffect } from "react";
import useAlchemySDK from "../hooks/useAlchemySDK";
import { GET_ALL_WAGERED } from "../graphql/queries";
import { useQuery } from "@apollo/client";
import { usePrivyWagmi } from "@privy-io/wagmi-connector";

const AllBets = () => {
  const { wallet: activeWallet, setActiveWallet } = usePrivyWagmi();
  const {
    loading,
    error,
    data: allWageredBets,
  } = useQuery(GET_ALL_WAGERED, {
    variables: { gambler: activeWallet?.address },
  });

  useEffect(() => {
    console.log(allWageredBets);
  }, [allWageredBets]);

  return (
    <div>
      <h1 className="text-4xl">All Bets</h1>
      <table className="min-w-full divide-y divide-gray-300">
        <thead>
          <tr>
            <th
              scope="col"
              className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">
              Amount
            </th>
            <th
              scope="col"
              className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
              Created by
            </th>
            <th
              scope="col"
              className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
              Interested?
            </th>
            <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0">
              <span className="sr-only">More</span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {/* {people.map((person) => (
            <tr key={person.email}>
              <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                {person.name}
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                {person.title}
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                {person.email}
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                {person.role}
              </td>
              <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                <a href="#" className="text-indigo-600 hover:text-indigo-900">
                  Edit<span className="sr-only">, {person.name}</span>
                </a>
              </td>
            </tr>
          ))} */}
        </tbody>
      </table>
    </div>
  );
};

export default AllBets;
