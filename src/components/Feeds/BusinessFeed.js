import React, { useMemo, useState } from 'react';

import ResultCard from '../ResultCard';
import NoResultsCard from '../Cards/NoResultsCard';
import { Box, SimpleGrid, useTheme } from '@chakra-ui/core';

import BusinessFilter from '../Filters/BusinessFilter';
import { getLocationZip } from '../../utils/locationUtils';

export default ({ setSearch, businesses }) => {
  const theme = useTheme();

  return (
    <Box
      maxW={theme.containers.main}
      paddingX={[null, theme.spacing.base, theme.spacing.lg]}
    >
      <BusinessFilter onSearch={filters => setSearch(filters)} />
      {businesses.length > 0 ? (
        <SimpleGrid columns={[null, 1, 2]} spacing={10}>
          {businesses.map((business, index) => (
            <ResultCard
              key={index}
              name={business.data.Business_Name}
              category={business.data.Category}
              description={business.data.Business_Description}
              location={business.data.Zip_Code}
              websiteUrl={business.data.Website}
            />
          ))}
        </SimpleGrid>
      ) : (
        <NoResultsCard type="businesses" />
      )}
    </Box>
  );
};
