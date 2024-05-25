"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { ChangeEvent, useEffect, useState } from "react";

const Searchbar = ({ routeType }: { routeType: string }) => {
  const [searchText, setSearchText] = useState("");

  const router = useRouter();

  function handleSearchChange(e: ChangeEvent<HTMLInputElement>) {
    e.preventDefault();
    setSearchText(e.target.value);
  }

  useEffect(() => {
    if (searchText) {
      router.push(`/${routeType}?q=${searchText}`);
    } else {
      router.push(`/${routeType}`);
    }
  }, [searchText]);

  return (
    <div className="searchbar flex gap-3">
      <Image src="/assets/search-gray.svg" alt="search" width={24} height={24} />
      <input
        type="text"
        className="searchbar_input w-full"
        placeholder={routeType === "search" ? "Search for users..." : "Search for communities..."}
        value={searchText}
        onChange={(e) => handleSearchChange(e)}
      />
    </div>
  );
};

export default Searchbar;
