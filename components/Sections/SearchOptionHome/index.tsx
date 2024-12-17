"use client";

import {
  DropdownBoxMultiWithSearch1,
  DropdownBoxMultiWithSearchMobile1,
  DropdownBoxWithSearch1,
  DropdownBoxWithSearchMobile1,
  NestedDropdownBoxMultiWithSearch1,
  NestedDropdownBoxMultiWithSearchMobile1,
  RangeInput,
} from "@/components/Forms";
import { BrandsMenu } from "@/components/Units";
import { DefaultTypeContext } from "@/context/DefaultTypeContext";
import { FilterContext } from "@/context/FilterContext";
import {
  SearchOptionHomeProps,
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
import styles from "./style.module.css";

const SearchOptionHome: React.FC<SearchOptionHomeProps> = ({ onSearch }) => {
  const { filterOption, setFilterOption } = useContext(FilterContext);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [brandList, setBrandList] = useState<brandInterface[]>([]);
  const [selectedBrandsDesktop, setSelectedBrandsDesktop] = useState<
    brandInterface[]
  >([]);
  const [selectedBrandsMobile, setSelectedBrandsMobile] = useState<
    dropdownItemInterface[]
  >([]);
  const [typeList, setTypeList] = useState<dropdownItemInterface[]>([]);
  const [selectedType, setSelectedType] = useState<dropdownItemInterface>();
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
  const [priceFrom, setPriceFrom] = useState<number>();
  const [priceTo, setPriceTo] = useState<number>();
  const [stepFrom, setStepFrom] = useState<number>();
  const [stepTo, setStepTo] = useState<number>();
  const { setDtypeId } = useContext(DefaultTypeContext);
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
      setSelectedBrandsDesktop(
        filterOption.brands.length === 0
          ? bl.filter((b) => b.available)
          : filterOption.brands.map((b: dropdownItemInterface) => ({
              id: b.value,
              available: b.available ?? true,
              file: null,
              title: b.label,
            }))
      );
      setSelectedBrandsMobile(
        filterOption.brands.length === 0
          ? bl
              .filter((b) => b.available)
              .map((i) => ({ label: removeHtmlTags(i.title), value: i.id }))
          : filterOption.brands
      );
      setFilterOption({
        ...filterOption,
        brands:
          filterOption.brands.length === 0
            ? bl
                .filter((b) => b.available)
                .map((i) => ({ label: removeHtmlTags(i.title), value: i.id }))
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
    setDtypeId(item.value);
    try {
      setSelectedType(item);
      setFilterOption({ ...filterOption, type: { ...item }, sizes: [] });
      const szs = mapSizesToDropdownData(await fetchSizesByTypeId(item.value));
      setSizeList(szs);
      setSelectedSizes([]);
    } catch (err) {
      console.log("Error fetching the sizes by the type id");
    }
  };

  const onChangeBrandDesktop = (items: brandInterface[]) => {
    setSelectedBrandsDesktop(items);
    setSelectedBrandsMobile(
      items.map((i) => ({ label: removeHtmlTags(i.title), value: i.id }))
    );
    setFilterOption({
      ...filterOption,
      brands: items.map((i) => ({
        label: removeHtmlTags(i.title),
        value: i.id,
      })),
    });
  };
  const onChangeBrandMobile = (items: dropdownItemInterface[]) => {
    setSelectedBrandsMobile(items);
    setSelectedBrandsDesktop(
      brandList.filter((b) => items.map((i) => i.value).includes(b.id))
    );
    setFilterOption({ ...filterOption, brands: items });
  };

  return (
    <>
      <div className="hidden lg:block">
        <BrandsMenu
          isLoading={isLoading}
          activeBrands={selectedBrandsDesktop}
          onSelect={onChangeBrandDesktop}
          list={brandList}
        />
        <div className={styles.formBar}>
          <div className={styles.formContainer}>
            <div className="h-full bg-white rounded-l-lg px-4 flex flex-col justify-center">
              <DropdownBoxWithSearch1
                list={typeList}
                label={t("common.type_size")}
                onChange={onChangeType}
                activeItem={selectedType}
                left={-16}
              />
            </div>
            <div className="h-full bg-white pl-4 flex flex-col justify-center">
              <DropdownBoxMultiWithSearch1
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
                left={-16}
              />
            </div>
            <div className="h-full bg-white pl-4 flex flex-col justify-center">
              <NestedDropdownBoxMultiWithSearch1
                list={categoryList}
                onChange={(vals: nestedDropdownItemInterface[]) => {
                  setSelectedCategories(vals);
                  setFilterOption({ ...filterOption, categories: vals });
                }}
                title={t("common.category")}
                totalTitle={t("common.all_category")}
                activeItems={selectedCategories}
                left={-16}
              />
            </div>
            <div className="h-full bg-white pl-4 flex flex-col justify-center">
              <DropdownBoxMultiWithSearch1
                list={variantList}
                onChange={(vals: dropdownItemInterface[]) => {
                  setSelectedVariants(vals);
                  setFilterOption({ ...filterOption, variants: vals });
                }}
                title={t("common.available")}
                totalTitle={t("common.all_variant")}
                activeItems={selectedVariants}
                left={-16}
              />
            </div>
            <div
              className="col-span-3 grid grid-cols-2 h-full"
              style={{ gap: "2px" }}
            >
              <div className="h-full bg-white px-4 flex flex-col justify-center">
                <RangeInput
                  fromPlaceholder={t("common.from")}
                  toPlaceholder={t("common.to")}
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
              <div className="h-full bg-white px-4 flex flex-col justify-center rounded-r-lg">
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
            </div>
          </div>
          <div className={styles.btn} onClick={() => onSearch()}>
            <span>{t("common.search_btn")}</span>
          </div>
        </div>
      </div>
      <div className="lg:hidden flex flex-col bg-gray-200 filter-mobile am-gapY-2px">
        <DropdownBoxMultiWithSearchMobile1
          list={brandList.map((b) => ({
            label: removeHtmlTags(b.title),
            value: b.id,
            available: b.available,
          }))}
          onChange={onChangeBrandMobile}
          title={t("common.brand")}
          totalTitle={t("common.all_brand")}
          activeItems={selectedBrandsMobile}
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
        <div className="p-5 px-4 bg-white">
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

export default SearchOptionHome;
