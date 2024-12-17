"use client";

import {
  DropdownBoxMultiWithSearchMobile1,
  DropdownBoxWithSearchMobile1,
  NestedDropdownBoxMultiWithSearchMobile1,
  RangeInput,
} from "@/components/Forms";
import { FilterContext } from "@/context/FilterContext";
import {
  SearchOptionLeftProps,
  brandInterface,
  dropdownItemInterface,
  nestedDropdownItemInterface,
} from "@/interfaces";
import { getAccountDefaultTypeSize } from "@/services/accountsApi";
import {
  fetchBrands,
  fetchCategories,
  fetchDefaultType,
  fetchDeliveryTypes,
  fetchSizesByTypeId,
  fetchTypes,
} from "@/services/directoriesApi";
import {
  mapCategoriesToNestedDropdownData,
  mapDeliveryTypesToDropdownData,
  mapSizesToDropdownData,
  mapTypesToDropdownData,
} from "@/utils/mapUtils";
import { removeHtmlTags } from "@/utils/stringUtils";
import { useTranslations } from "next-intl";
import { useContext, useEffect, useState } from "react";

const SearchOptionLeft: React.FC<SearchOptionLeftProps> = ({ onSearch }) => {
  const { filterOption, setFilterOption } = useContext(FilterContext);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [brandList, setBrandList] = useState<brandInterface[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<dropdownItemInterface[]>(
    []
  );
  const [typeList, setTypeList] = useState<dropdownItemInterface[]>([]);
  const [selectedType, setSelectedType] = useState<
    dropdownItemInterface | undefined
  >();
  const [sizeList, setSizeList] = useState<dropdownItemInterface[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<dropdownItemInterface[]>(
    []
  );
  const [categoryList, setCategoryList] = useState<
    nestedDropdownItemInterface[]
  >([]);
  const [selectedCategories, setSelectedCategories] = useState<
    nestedDropdownItemInterface[]
  >([]);
  const [variantList, setVariantList] = useState<dropdownItemInterface[]>([]);
  const [selectedVariants, setSelectedVariants] = useState<
    dropdownItemInterface[]
  >([]);
  const [priceFrom, setPriceFrom] = useState<number | undefined>();
  const [priceTo, setPriceTo] = useState<number | undefined>();
  const [stepFrom, setStepFrom] = useState<number | undefined>();
  const [stepTo, setStepTo] = useState<number | undefined>();
  const t = useTranslations();

  useEffect(() => {
    getInitData();
  }, []);

  const getInitData = async (): Promise<void> => {
    setIsLoading(true);
    try {
      const dt = filterOption.type
        ? { id: filterOption.type.value, title: filterOption.type.label }
        : sessionStorage.getItem("access")
        ? await getAccountDefaultTypeSize()
        : await fetchDefaultType();
      const tl = mapTypesToDropdownData(await fetchTypes());
      const cl = mapCategoriesToNestedDropdownData(await fetchCategories());
      const bl = await fetchBrands();
      const vl = mapDeliveryTypesToDropdownData(await fetchDeliveryTypes());
      if (dt) {
        const szs = mapSizesToDropdownData(await fetchSizesByTypeId(dt.id));
        setSizeList(szs);
      }
      setTypeList(tl);
      setCategoryList(cl);
      setBrandList(bl);
      setVariantList(vl);
      setSelectedBrands(
        filterOption.brands.length === 0
          ? bl
              .filter((b) => b.available === true)
              .map((b) => ({
                label: b.title,
                value: b.id,
              }))
          : filterOption.brands
      );
      setFilterOption({
        ...filterOption,
        brands:
          filterOption.brands.length === 0
            ? bl
                .filter((b) => b.available === true)
                .map((b) => ({
                  label: b.title,
                  value: b.id,
                }))
            : filterOption.brands,
        type: { value: dt.id, label: dt.title },
      });
      setSelectedType({ value: dt.id, label: dt.title });
      setSelectedSizes(filterOption.sizes);
      setSelectedCategories(filterOption.categories);
      setSelectedVariants(filterOption.variants);
      setPriceFrom(filterOption.priceFrom);
      setPriceTo(filterOption.priceTo);
      setStepFrom(filterOption.stepFrom);
      setStepTo(filterOption.stepTo);
    } catch (err) {
      console.log("Error fetching the initial data");
    } finally {
      setIsLoading(false);
    }
  };

  const onChangeType = async (item: dropdownItemInterface) => {
    try {
      setSelectedType(item);
      setFilterOption({ ...filterOption, type: { ...item }, sizes: [] });
      const szs = mapSizesToDropdownData(await fetchSizesByTypeId(item.value));
      setSizeList(szs);
      setSelectedSizes([]);
    } catch (err) {
      console.log("Error fetching sizes by type id");
    }
  };

  return (
    <>
      <div className="hidden lg:flex flex-col rounded-lg shadow-custom-7 relative bg-gray-200 am-gapY-2px">
        <DropdownBoxMultiWithSearchMobile1
          list={brandList.map((b) => ({
            label: removeHtmlTags(b.title),
            value: b.id,
            available: b.available,
          }))}
          onChange={(vals: dropdownItemInterface[]) => {
            setSelectedBrands(vals);
            setFilterOption({ ...filterOption, brands: vals });
          }}
          title={t("common.brand")}
          totalTitle={t("common.all_brand")}
          activeItems={selectedBrands}
          type="desktop"
          style={{ borderRadius: "8px 8px 0 0" }}
          searchable={false}
        />
        <DropdownBoxWithSearchMobile1
          list={typeList}
          label={t("common.type_size")}
          onChange={onChangeType}
          activeItem={selectedType}
          type="desktop"
        />
        <DropdownBoxMultiWithSearchMobile1
          list={sizeList}
          onChange={(vals: dropdownItemInterface[]) => {
            setSelectedSizes(vals);
            setFilterOption({ ...filterOption, sizes: vals });
          }}
          title={t("common.size")}
          totalTitle={t("common.all_size")}
          maxCount={5}
          maxErrMsg={t("home.max_size_err")}
          activeItems={selectedSizes}
          type="desktop"
        />
        <NestedDropdownBoxMultiWithSearchMobile1
          list={categoryList}
          onChange={(vals: nestedDropdownItemInterface[]) => {
            setSelectedCategories(vals);
            setFilterOption({ ...filterOption, categories: vals });
          }}
          title={t("common.category")}
          totalTitle={t("common.all_category")}
          activeItems={selectedCategories}
          type="desktop"
        />
        <DropdownBoxMultiWithSearchMobile1
          list={variantList}
          onChange={(vals: dropdownItemInterface[]) => {
            setSelectedVariants(vals);
            setFilterOption({ ...filterOption, variants: vals });
          }}
          title={t("common.available")}
          totalTitle={t("common.all_variant")}
          activeItems={selectedVariants}
          type="desktop"
        />
        <div className="px-4 bg-white">
          <RangeInput
            fromPlaceholder={t("home.price_from")}
            toPlaceholder={t("home.price_to")}
            unit="₽"
            onChangeFromVal={(val?: number) => {
              setPriceFrom(val);
              setFilterOption({ ...filterOption, priceFrom: val });
            }}
            onChangeToVal={(val?: number) => {
              setPriceTo(val);
              setFilterOption({ ...filterOption, priceTo: val });
            }}
            fromActiveVal={priceFrom}
            toActiveVal={priceTo}
          />
        </div>
        <div className="px-4 bg-white">
          <RangeInput
            fromPlaceholder={t("common.from")}
            toPlaceholder={t("common.to")}
            unit="шт."
            onChangeFromVal={(val?: number) => {
              setStepFrom(val);
              setFilterOption({ ...filterOption, stepFrom: val });
            }}
            onChangeToVal={(val?: number) => {
              setStepTo(val);
              setFilterOption({ ...filterOption, stepTo: val });
            }}
            fromActiveVal={stepFrom}
            toActiveVal={stepTo}
          />
        </div>
        <div className="py-5 px-4 rounded-b-lg bg-white">
          <div
            className="btn-primary"
            onClick={() => {
              onSearch();
            }}
          >
            {t("common.search_btn")}
          </div>
        </div>
      </div>
      <div className="lg:hidden flex flex-col bg-gray-200 am-gapY-2px">
        <DropdownBoxMultiWithSearchMobile1
          list={brandList.map((b) => ({
            label: removeHtmlTags(b.title),
            value: b.id,
            available: b.available,
          }))}
          onChange={(vals: dropdownItemInterface[]) => {
            setSelectedBrands(vals);
            setFilterOption({ ...filterOption, brands: vals });
          }}
          title={t("common.brand")}
          totalTitle={t("common.all_brand")}
          activeItems={selectedBrands}
          isShowTotalTitle={true}
          searchable={false}
        />
        <DropdownBoxWithSearchMobile1
          list={typeList}
          label={t("common.type_size")}
          onChange={onChangeType}
          activeItem={selectedType}
        />
        <DropdownBoxMultiWithSearchMobile1
          list={sizeList}
          onChange={(vals: dropdownItemInterface[]) => {
            setSelectedSizes(vals);
            setFilterOption({ ...filterOption, sizes: vals });
          }}
          title={t("common.size")}
          totalTitle={t("common.all_size")}
          maxCount={5}
          maxErrMsg={t("home.max_size_err")}
          activeItems={selectedSizes}
        />
        <NestedDropdownBoxMultiWithSearchMobile1
          list={categoryList}
          onChange={(vals: nestedDropdownItemInterface[]) => {
            setSelectedCategories(vals);
            setFilterOption({ ...filterOption, categories: vals });
          }}
          title={t("common.category")}
          totalTitle={t("common.all_category")}
          activeItems={selectedCategories}
        />
        <DropdownBoxMultiWithSearchMobile1
          list={variantList}
          onChange={(vals: dropdownItemInterface[]) => {
            setSelectedVariants(vals);
            setFilterOption({ ...filterOption, variants: vals });
          }}
          title={t("common.available")}
          totalTitle={t("common.all_variant")}
          activeItems={selectedVariants}
        />
        <div className="px-4 bg-white">
          <RangeInput
            fromPlaceholder={t("common.price_from")}
            toPlaceholder={t("common.price_to")}
            unit="₽"
            onChangeFromVal={(val?: number) => {
              setPriceFrom(val);
              setFilterOption({ ...filterOption, priceFrom: val });
            }}
            onChangeToVal={(val?: number) => {
              setPriceTo(val);
              setFilterOption({ ...filterOption, priceTo: val });
            }}
            fromActiveVal={priceFrom}
            toActiveVal={priceTo}
          />
        </div>
        <div className="px-4 bg-white">
          <RangeInput
            fromPlaceholder={t("common.from")}
            toPlaceholder={t("common.to")}
            unit="шт."
            onChangeFromVal={(val?: number) => {
              setStepFrom(val);
              setFilterOption({ ...filterOption, stepFrom: val });
            }}
            onChangeToVal={(val?: number) => {
              setStepTo(val);
              setFilterOption({ ...filterOption, stepTo: val });
            }}
            fromActiveVal={stepFrom}
            toActiveVal={stepTo}
          />
        </div>
        <div className="py-5 px-4 bg-white">
          <div
            className="btn-primary"
            onClick={() => {
              onSearch();
            }}
          >
            {t("common.search_btn")}
          </div>
        </div>
      </div>
    </>
  );
};

export default SearchOptionLeft;
