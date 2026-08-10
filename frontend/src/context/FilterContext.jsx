import React, { createContext, useContext, useState } from 'react';

const FilterContext = createContext();

export const FilterProvider = ({ children }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArea, setSelectedArea] = useState('');
  const [spicyLevel, setSpicyLevel] = useState(null);
  const [isChulhivarchi, setIsChulhivarchi] = useState(null);
  const [activitySlug, setActivitySlug] = useState('');
  const [sortBy, setSortBy] = useState('recommended');
  const [page, setPage] = useState(1);
  const [userCoords, setUserCoords] = useState(null);
  const [isNearMeActive, setIsNearMeActive] = useState(false);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedArea('');
    setSpicyLevel(null);
    setIsChulhivarchi(null);
    setActivitySlug('');
    setSortBy('recommended');
    setPage(1);
    setIsNearMeActive(false);
    setUserCoords(null);
  };

  return (
    <FilterContext.Provider
      value={{
        searchQuery,
        setSearchQuery,
        selectedArea,
        setSelectedArea,
        spicyLevel,
        setSpicyLevel,
        isChulhivarchi,
        setIsChulhivarchi,
        activitySlug,
        setActivitySlug,
        sortBy,
        setSortBy,
        page,
        setPage,
        userCoords,
        setUserCoords,
        isNearMeActive,
        setIsNearMeActive,
        resetFilters,
      }}
    >
      {children}
    </FilterContext.Provider>
  );
};

export const useFilters = () => useContext(FilterContext);
