import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ToastContainer, toast } from "react-toastify";
import { debounce } from "lodash";
import { getProducts, getProductById } from "../services/api/products";
import { getProductReviews, submitReview } from "../services/api/reviews";
import { useCart } from "../hooks/useCart";
import { useWishlist } from "../hooks/useWishlist";
import { useAuth } from "../hooks/useAuth";
import Navbar from "../components/Navbar";
import Header from "../components/Header";
import BenefitsBar from "../components/BenefitsBar";
import Filters from "../components/Filters";
import ProductList from "../components/ProductList";
import AuthModal from "../components/AuthModal";
import QuickViewModal from "../components/QuickView/QuickViewModal";
import CartSidebar from "../components/CartSidebar";
import ErrorBoundary from "../components/ErrorBoundary";
import LoadingSpinner from "../components/LoadingSpinner";
import "react-toastify/dist/ReactToastify.css";
import LipaNaMpesa from "@/components/LipaNaMpesa";




const Products = () => {
  const [category, setCategory] = useState("all");
  const [sortBy, setSortBy] = useState("featured");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [isCartOpen, setCartOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState("login");
  const [quickViewProductId, setQuickViewProductId] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const scrollPositionRef = useRef(0);

  const queryClient = useQueryClient();
  const {
    currentUser,
    isLoadingUser,
    login,
    register,
    logout,
    isLoggingIn,
    isRegistering,
  } = useAuth();
  const {
    cart,
    cartCount,
    isLoadingCart,
    addToCart,
    updateCartItem,
    removeFromCart,
  } = useCart();
  const { wishlist, isLoadingWishlist, toggleWishlist, removeFromWishlist } =
    useWishlist();

  const {
    data: productsData,
    isLoading: isLoadingProducts,
    isError,
    error: productsError,
    isPreviousData,
  } = useQuery({
    queryKey: [
      "products",
      category,
      sortBy,
      searchTerm,
      currentPage,
      itemsPerPage,
    ],
    queryFn: async () => {
      scrollPositionRef.current = window.scrollY;
      const data = await getProducts(currentPage, itemsPerPage, {
        category: category !== "all" ? category : undefined,
        sort: sortBy,
        search: searchTerm,
      });
      
      return {
        products: data.products || [],
        pagination: data.pagination || {
          page: currentPage,
          limit: itemsPerPage,
          total: 0,
          pages: 1,
          hasNext: false,
          hasPrev: false
        }
      };
    },
    staleTime: 1000 * 60 * 5,
    keepPreviousData: true,
  });

  // Restore scroll position after data loads
  useEffect(() => {
    if (!isLoadingProducts && !isPreviousData && scrollPositionRef.current > 0) {
      window.scrollTo(0, scrollPositionRef.current);
      scrollPositionRef.current = 0;
    }
  }, [isLoadingProducts, isPreviousData]);

  const { data: quickViewProduct, isLoading: isLoadingQuickView } = useQuery({
    queryKey: ["product", quickViewProductId],
    queryFn: () => getProductById(quickViewProductId),
    enabled: !!quickViewProductId,
    staleTime: 1000 * 60 * 5,
  });

  const { data: reviews = [], isLoading: isLoadingReviews } = useQuery({
    queryKey: ["reviews", quickViewProductId],
    queryFn: () => getProductReviews(quickViewProductId),
    enabled: !!quickViewProductId,
    staleTime: 1000 * 60 * 5,
  });

  const submitReviewMutation = useMutation({
    mutationFn: ({ productId, review }) => submitReview(productId, review),
    onSuccess: () => {
      queryClient.invalidateQueries(["reviews", quickViewProductId]);
      queryClient.invalidateQueries(["products"]);
      toast.success("Review submitted successfully");
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to submit review");
    },
  });

  const isLoading = useMemo(
    () =>
      isLoadingProducts || isLoadingUser || isLoadingCart || isLoadingWishlist,
    [isLoadingProducts, isLoadingUser, isLoadingCart, isLoadingWishlist]
  );

  const debouncedSearch = useMemo(
    () =>
      debounce((value) => {
        setSearchTerm(value);
        setCurrentPage(1);
      }, 300),
    []
  );

 const handleWishlistToggle = useCallback(
  (productId) => {
    const existingItem = wishlist.find((item) => item.productId === productId);
    if (existingItem) {
      removeFromWishlist(existingItem._id); // ✅ Use _id, not productId
      
    } else {
      toggleWishlist(productId);
    
    }
  },
  [wishlist, toggleWishlist, removeFromWishlist]
);


  const openQuickView = useCallback(
    (productId) => setQuickViewProductId(productId),
    []
  );
  const closeQuickView = useCallback(() => setQuickViewProductId(null), []);

  const handlePageChange = useCallback(
    (page) => {
      setCurrentPage(page);
    },
    []
  );

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = authModalOpen ? "hidden" : "auto";
  }, [authModalOpen]);

  useEffect(() => () => debouncedSearch.cancel(), [debouncedSearch]);

  return (
    <ErrorBoundary>
      <div className="relative min-h-screen bg-gray-50">
        <div className="sticky top-0 z-[100] bg-white shadow-md transition-all duration-300">
          <div
            className={`${
              isScrolled
                ? "h-0 opacity-0 overflow-hidden"
                : "h-auto opacity-100"
            } transition-all duration-300`}
          >
            <Navbar />
          </div>
          <Header
            currentUser={currentUser}
            cartCount={cartCount}
            setCartOpen={setCartOpen}
            setAuthModalOpen={setAuthModalOpen}
            setAuthMode={setAuthMode}
            logout={logout}
            isScrolled={isScrolled}
          />
        </div>

        <main className="container mx-auto px-4 sm:px-6 pt-8">
          {isLoading && (
            <div
              className="fixed inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50"
              style={{ top: "72px" }}
            >
              <LoadingSpinner size="lg" />
            </div>
          )}

          <BenefitsBar />

          <Filters
            category={category}
            setCategory={(val) => {
              setCategory(val);
              setCurrentPage(1);
              debouncedSearch("");
            }}
            sortBy={sortBy}
            setSortBy={(val) => {
              setSortBy(val);
              setCurrentPage(1);
            }}
            itemsPerPage={itemsPerPage}
            setItemsPerPage={(val) => {
              setItemsPerPage(val);
              setCurrentPage(1);
            }}
            onSearch={debouncedSearch}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalItems={productsData?.pagination?.total || 0}
            isScrolled={isScrolled}
          />

          {isError ? (
            <div className="text-center text-red-600 py-8" role="alert">
              {productsError?.message ||
                "Failed to load products. Try again later."}
            </div>
          ) : (
            <ProductList
              products={productsData?.products || []}
              loading={isLoadingProducts}
              error={productsError}
              pagination={{
                page: productsData?.pagination?.page || currentPage,
                pages: productsData?.pagination?.pages || 1,
                hasNext: productsData?.pagination?.hasNext || false,
                hasPrev: productsData?.pagination?.hasPrev || false,
                total: productsData?.pagination?.total || 0
              }}
              onPageChange={handlePageChange}
              onAddToCart={addToCart}
              onWishlistToggle={handleWishlistToggle}
              onQuickView={openQuickView}
              wishlistItems={wishlist}
              itemsPerPage={itemsPerPage}
            />
          )}
        </main>

        <AuthModal
          isOpen={authModalOpen}
          onClose={() => setAuthModalOpen(false)}
          authMode={authMode}
          setAuthMode={setAuthMode}
          login={login}
          register={register}
          isLoggingIn={isLoggingIn}
          isRegistering={isRegistering}
        />

        <QuickViewModal
          product={quickViewProduct}
          isOpen={!!quickViewProductId}
          onClose={closeQuickView}
          addToCart={addToCart}
          toggleWishlist={toggleWishlist}
          removeFromWishlist={removeFromWishlist}
          isInWishlist={wishlist.some(
            (item) => item.productId === quickViewProductId
          )}
          reviews={reviews}
          currentUser={currentUser}
          submitReview={submitReviewMutation.mutate}
          setAuthModalOpen={setAuthModalOpen}
          setAuthMode={setAuthMode}
          isLoading={isLoadingQuickView || isLoadingReviews}
        />

        <CartSidebar
          isOpen={isCartOpen}
          onClose={() => setCartOpen(false)}
          cart={cart}
          products={productsData?.products || []}
          updateCartItem={updateCartItem}
          removeFromCart={removeFromCart}
          currentUser={currentUser}
          setAuthModalOpen={setAuthModalOpen}
          setAuthMode={setAuthMode}
        />

        <LipaNaMpesa />

<ToastContainer
  position="bottom-right"
  autoClose={2000} // ⏱ Faster, but not too fast
  hideProgressBar
  closeOnClick
  pauseOnFocusLoss={false} // 🔇 no queue when you tab back
  pauseOnHover={false}     // ⏩ no hang if user hovers
  draggable={false}        // 🖱️ keeps layout still
  newestOnTop              // 🆕 recent toasts on top
  limit={2}                // ⛔ prevents stacking overload
  theme="colored"
/>

      </div>
    </ErrorBoundary>
  );
};

export default Products;