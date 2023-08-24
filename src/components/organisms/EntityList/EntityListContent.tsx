import {FC, memo, useContext, useEffect, useState} from 'react';
import {useSearchParams} from 'react-router-dom';

import {isEqual, merge} from 'lodash';

import {MainContext} from '@contexts/MainContext';
import {ModalContext} from '@contexts/ModalContext';

import {Button} from '@custom-antd/Button';

import {useTrackTimeAnalytics} from '@hooks/useTrackTimeAnalytics';

import type {EntityListBlueprint} from '@models/entity';

import {EntityGrid} from '@molecules/EntityGrid';

import {PageWrapper} from '@organisms/PageBlueprint.styled';
import {PageHeader} from '@organisms/PageBlueprint/PageHeader';
import {PageToolbar} from '@organisms/PageBlueprint/PageToolbar';

import {PageMetadata} from '@pages/PageMetadata';

import {Permissions, usePermission} from '@permissions/base';

import {initialPageSize} from '@redux/initialState';

import {useApiEndpoint} from '@services/apiEndpoint';

import {StyledFiltersSection} from './EntityListContent.styled';
import {EmptyDataWithFilters} from './EntityListContent/EmptyDataWithFilters';
import {EntityListFilters as Filters} from './EntityListFilters';

export const EntityListContent: FC<EntityListBlueprint> = memo(props => {
  const {
    itemKey,
    pageTitle,
    pageTitleAddon,
    pageDescription: PageDescription,
    emptyDataComponent: EmptyData,
    CardComponent,
    entity,
    initialFiltersState,
    addEntityButtonText,
    dataTest,
    isLoading = false,
    isFetching = false,
    queryFilters,
    data,
    setQueryFilters,
    createModalConfig,
    onItemClick,
    onItemAbort,
  } = props;

  const [isFirstTimeLoading, setFirstTimeLoading] = useState(true);
  const [isApplyingFilters, setIsApplyingFilters] = useState(false);
  const [isLoadingNext, setIsLoadingNext] = useState(false);

  const {isClusterAvailable} = useContext(MainContext);
  const {setModalConfig, setModalOpen} = useContext(ModalContext);
  const apiEndpoint = useApiEndpoint();
  const mayCreate = usePermission(Permissions.createEntity);

  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const filters = merge({}, initialFiltersState, queryFilters, {
      textSearch: searchParams.get('textSearch') ?? undefined,
      status: searchParams.get('status')?.split(',').filter(Boolean) ?? undefined,
      selector: searchParams.get('selector')?.split(',').filter(Boolean) ?? undefined,
    });
    if (!isEqual(filters, queryFilters)) {
      setQueryFilters(filters);
    }
  }, []);

  useEffect(() => {
    const newSearchParams = new URLSearchParams(searchParams);
    if (queryFilters.textSearch) {
      newSearchParams.set('textSearch', queryFilters.textSearch);
    } else {
      newSearchParams.delete('textSearch');
    }
    if (queryFilters.status?.length) {
      newSearchParams.set('status', queryFilters.status.join(','));
    } else {
      newSearchParams.delete('status');
    }
    if (queryFilters.selector?.length) {
      newSearchParams.set('selector', queryFilters.selector.join(','));
    } else {
      newSearchParams.delete('selector');
    }
    setSearchParams(newSearchParams);
  }, [queryFilters]);

  const resetFilters = () => {
    setQueryFilters(initialFiltersState);
  };

  const onScrollBottom = () => {
    setIsLoadingNext(true);
    setQueryFilters({...queryFilters, pageSize: queryFilters.pageSize + initialPageSize});
  };

  useEffect(() => {
    if (!isLoading && !isFetching) {
      setFirstTimeLoading(false);
    }
  }, [data, isLoading, isFetching]);

  useEffect(() => {
    setFirstTimeLoading(true);
  }, [entity, apiEndpoint]);

  useEffect(() => {
    setIsApplyingFilters(true);
  }, [queryFilters]);

  useEffect(() => {
    if (!isFetching) {
      setIsLoadingNext(false);
      setIsApplyingFilters(false);
    }
  }, [isFetching]);

  const isFiltersEmpty = isEqual(initialFiltersState, queryFilters);
  const isEmptyData = !data?.length && isFiltersEmpty && !isLoading;

  const addEntityAction = () => {
    setModalConfig(createModalConfig);
    setModalOpen(true);
  };

  useTrackTimeAnalytics(`${entity}-list`);

  const createButton = mayCreate ? (
    <Button $customType="primary" onClick={addEntityAction} data-test={dataTest} disabled={!isClusterAvailable}>
      {addEntityButtonText}
    </Button>
  ) : null;

  return (
    <PageWrapper>
      <PageMetadata title={pageTitle} />

      <PageHeader
        title={pageTitle}
        pageTitleAddon={pageTitleAddon}
        description={<PageDescription />}
        loading={isApplyingFilters && !isFirstTimeLoading}
      >
        <PageToolbar extra={createButton}>
          <StyledFiltersSection>
            <Filters
              setFilters={setQueryFilters}
              filters={queryFilters}
              isFiltersDisabled={isEmptyData || !isClusterAvailable}
            />
          </StyledFiltersSection>
        </PageToolbar>
      </PageHeader>

      <EntityGrid
        itemKey={itemKey}
        maxColumns={2}
        data={data}
        Component={CardComponent}
        componentProps={{onClick: onItemClick, onAbort: onItemAbort}}
        empty={
          isFiltersEmpty ? <EmptyData action={addEntityAction} /> : <EmptyDataWithFilters resetFilters={resetFilters} />
        }
        itemHeight={163.85}
        loadingInitially={isFirstTimeLoading}
        loadingMore={isLoadingNext}
        hasMore={!isLoadingNext && data && queryFilters.pageSize <= data.length}
        onScrollEnd={onScrollBottom}
      />
    </PageWrapper>
  );
});