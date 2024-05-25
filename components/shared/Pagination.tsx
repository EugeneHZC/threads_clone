"use client";

import { useRouter } from "next/navigation";
import { Button } from "../ui/button";

const Pagination = ({ path, isNext, pageNumber }: { path: string; isNext: boolean; pageNumber: number }) => {
  const router = useRouter();

  function handleNavigation(e: React.MouseEvent<HTMLButtonElement, MouseEvent>, type: string) {
    e.preventDefault();

    switch (type) {
      case "prev":
        router.push(`/${path}?page=${pageNumber - 1}`);
        break;
      case "next":
        router.push(`/${path}?page=${pageNumber + 1}`);
        break;
      default:
        break;
    }
  }

  return (
    <div className="pagination">
      <Button
        className="!text-small-regular text-light-2"
        disabled={pageNumber <= 1}
        onClick={(e) => handleNavigation(e, "prev")}
      >
        Prev
      </Button>
      <p className="text-light-2 text-small-semibold">{pageNumber}</p>
      <Button
        className="!text-small-regular text-light-2"
        disabled={!isNext}
        onClick={(e) => handleNavigation(e, "next")}
      >
        Next
      </Button>
    </div>
  );
};

export default Pagination;
