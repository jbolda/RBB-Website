import React, { useState, useEffect } from 'react';
import algoliasearch from 'algoliasearch/lite';

import { navigate, graphql } from 'gatsby';
import { Flex } from '@chakra-ui/core';
import { PageHero, Layout, BusinessFeed, Pagination } from '../components';
import CardSkeleton from '../components/Loading/CardSkeleton';

const client = algoliasearch('LRWZTMM362', 'b1556413e51961cacf7dbb37f22f4094');
const index = client.initIndex('businesses');

const LOADING_STATE = {
  NONE: 'none',
  INITIAL: 'intial',
  SEARCHING: 'searching',
};

function useAlgoliaSearch() {
  const [results, setResults] = useState([]);
  const [search, setSearch] = useState({
    type: '',
    location: '',
    need: 'true',
  });
  const [loadingState, setLoadingState] = useState(LOADING_STATE.INITIAL);
  const [totalPages, setTotalPages] = useState(0);
  const [totalResults, setTotalResults] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (loadingState !== LOADING_STATE.INITIAL) {
      async function getBusinesses() {
        try {
          const algoliaResponse = await index.search(search.location, {
            page: currentPage,
          });

          setResults(algoliaResponse.hits);
          setTotalPages(algoliaResponse.nbPages);
          setTotalResults(algoliaResponse.nbHits);
          setLoadingState(LOADING_STATE.NONE);
        } catch (e) {
          console.log('error searching', e);
        }
      }

      getBusinesses();
    }
  }, [currentPage, search]);

  return {
    results,
    totalPages,
    totalResults,
    currentPage,
    loadingState,
    setCurrentPage,
    setSearch,
  };
}

export default function Businesses(data) {
  // AirTable passes us and extra data...
  const businessFeedData = data.data.allAirtableBusinesses.nodes;
  const {
    currentPage,
    loadingState,
    results,
    totalPages,
    totalResults,
    setPage,
    goToPage,
    setCurrentPage,
    setSearch,
  } = useAlgoliaSearch();

  const pageSubtitle = (
    <p>
      These business owners have been impacted during the protests. Your support
      will assist their rebuilding efforts. If you are a business owner in need,
      please <a href="#temp">sign up to be added to our list</a>
    </p>
  );

  const heroBackgroundImageUrl =
    'http://res.cloudinary.com/rebuild-black-business/image/upload/f_auto/v1/assets/business-header';

  const isInitial = loadingState === LOADING_STATE.INITIAL;

  return (
    <Layout>
      <Flex align="center" justify="center" direction="column">
        <PageHero
          title="Businesses"
          subtitle={pageSubtitle}
          heroImageUrl={heroBackgroundImageUrl}
          hasFadedHeroImage
        />
        <CardSkeleton data={businessFeedData}>
          <BusinessFeed
            setSearch={setSearch}
            businesses={isInitial ? businessFeedData : results}
          />
        </CardSkeleton>

        <Pagination
          onPageChanged={pagination =>
            isInitial
              ? navigate(
                  `/businesses/${
                    pagination.currentPage === 1
                      ? ''
                      : `${pagination.currentPage}/`
                  }`
                )
              : goToPage(pagination.currentPage)
          }
          totalRecords={
            isInitial ? data.pageContext.totalRecords : totalResults
          }
          pageLimit={isInitial ? data.pageContext.itemsPerPage : results.length}
        />
      </Flex>
    </Layout>
  );
}

export const query = graphql`
  query($itemsPerPage: Int!, $skip: Int!) {
    allAirtableBusinesses(limit: $itemsPerPage, skip: $skip) {
      nodes {
        data {
          Email
          Name
          Business_Name
          Category
          Zip_Code
          Business_Description
          Website
          Donation_Link
          In_Need
          CreatedAt
        }
      }
    }
  }
`;
