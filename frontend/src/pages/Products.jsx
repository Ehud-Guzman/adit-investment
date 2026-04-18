import {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from "react";
import { createPortal } from "react-dom";
import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "react-toastify";
import { debounce } from "lodash";
import { FiFilter, FiSearch, FiX } from "react-icons/fi";
import {
  getProducts,
  getProductById,
} from "@/services/api/products";
import {
  getProductReviews,
  submitReview,
} from "@/services/api/reviews";
import { useCart } from "@/hooks/useCart";
import { useWishlist } from "@/hooks/useWishlist";
import { useAuth } from "@/hooks/useAuth";
import Filters from "@/components/Filters";
import HeaderButtons from "@/components/HeaderButtons";
import ProductList from "@/components/ProductList";
import AuthModal from "@/components/AuthModal";
import QuickViewModal from "@/components/QuickView/QuickViewModal";
import CartSidebar from "@/components/CartSidebar";
import ErrorBoundary from "@/components/ErrorBoundary";
import LoadingSpinner from "@/components/LoadingSpinner";
import LipaNaMpesa from "@/components/LipaNaMpesa";
import "react-toastify/dist/ReactToastify.css";

const Products = () => {
  // === STATE ===
  const [category, setCategory] = useState("all");
  const [sortBy, setSortBy] = useState("featured");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(24);
  const [isCartOpen, setCartOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState("login");
  const [quickViewProductId, setQuickViewProductId] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const scrollPositionRef = useRef(0);

  const queryClient = useQueryClient();

  // === HOOKS ===
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

  const {
    wishlist,
    isLoadingWishlist,
    toggleWishlist,
    removeFromWishlist,
  } = useWishlist();

  // === PRODUCTS QUERY ===
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
          hasPrev: false,
        },
      };
    },
    staleTime: 1000 * 60 * 5,
    keepPreviousData: true,
  });

  // === QUICK VIEW & REVIEWS ===
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
    mutationFn: ({ productId, review }) =>
      submitReview(productId, review),
    onSuccess: () => {
      queryClient.invalidateQueries(["reviews", quickViewProductId]);
      queryClient.invalidateQueries(["products"]);
      toast.success("✅ Review submitted");
    },
    onError: (err) => {
      toast.error(
        err?.response?.data?.message || "Failed to submit review"
      );
    },
  });

  // === SEARCH DEBOUNCE ===
  const debouncedSearch = useMemo(
    () =>
      debounce((value) => {
        setSearchTerm(value);
        setCurrentPage(1);
      }, 300),
    []
  );

  useEffect(() => () => debouncedSearch.cancel(), [debouncedSearch]);

  // === SCROLL RESTORE ===
  useEffect(() => {
    if (!isLoadingProducts && !isPreviousData && scrollPositionRef.current > 0) {
      window.scrollTo(0, scrollPositionRef.current);
      scrollPositionRef.current = 0;
    }
  }, [isLoadingProducts, isPreviousData]);

  // === CALLBACKS ===
  const handleWishlistToggle = useCallback(
    (productId) => {
      const existing = wishlist.find((item) => item.productId === productId);
      if (existing) {
        removeFromWishlist(existing._id);
      } else {
        toggleWishlist(productId);
      }
    },
    [wishlist, toggleWishlist, removeFromWishlist]
  );

  const handlePageChange = useCallback((page) => setCurrentPage(page), []);
  const openQuickView = useCallback((id) => setQuickViewProductId(id), []);
  const closeQuickView = useCallback(() => setQuickViewProductId(null), []);

  useEffect(() => {
    document.body.style.overflow = authModalOpen ? "hidden" : "auto";
  }, [authModalOpen]);

  const handleCartClick = () => {
    if (!currentUser) {
      toast.info("Please log in to view your cart");
      setAuthMode("login");
      setAuthModalOpen(true);
    } else if (!currentUser.isVerified) {
      toast.warning("Please verify your email before using the cart.");
    } else {
      setCartOpen(true);
    }
  };

  const handleSearchChange = (e) => {
    setSearchInput(e.target.value);
    debouncedSearch(e.target.value);
  };

  const clearSearch = () => {
    setSearchInput("");
    debouncedSearch("");
  };

  // Only block the page for product/user loads — cart & wishlist load silently
  const isLoading = useMemo(
    () => isLoadingProducts || isLoadingUser,
    [isLoadingProducts, isLoadingUser]
  );

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50">

        {/* ── Slim top bar: search + cart/account ── */}
        <div className="sticky top-16 md:top-20 z-[90] bg-white border-b border-gray-200 shadow-sm">
          <div className="px-4 sm:px-6 py-2.5 flex items-center gap-3">
            {/* Mobile filter toggle */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden flex items-center gap-1.5 text-sm font-medium text-gray-600 border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50 shrink-0"
            >
              <FiFilter size={14} /> Filters
            </button>

            {/* Search */}
            <div className="flex-1 relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
              <input
                type="text"
                value={searchInput}
                onChange={handleSearchChange}
                placeholder="Search products..."
                className="w-full pl-9 pr-8 py-2 border border-gray-200 rounded-full text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {searchInput && (
                <button onClick={clearSearch} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  <FiX size={13} />
                </button>
              )}
            </div>

            {/* Cart + Account */}
            <HeaderButtons
              cartCount={cartCount}
              currentUser={currentUser}
              handleCartClick={handleCartClick}
              logout={logout}
              setAuthModalOpen={setAuthModalOpen}
              setAuthMode={setAuthMode}
            />
          </div>
        </div>

        {/* ── Sidebar + content ── */}
        <div className="flex">

          {/* Desktop sidebar */}
          <aside className="hidden md:block w-60 shrink-0 sticky top-[116px] md:top-[132px] self-start h-[calc(100vh-116px)] md:h-[calc(100vh-132px)] overflow-y-auto bg-white border-r border-gray-200">
            <Filters
              category={category}
              setCategory={(val) => { setCategory(val); setCurrentPage(1); }}
              sortBy={sortBy}
              setSortBy={(val) => { setSortBy(val); setCurrentPage(1); }}
              itemsPerPage={itemsPerPage}
              setItemsPerPage={(val) => { setItemsPerPage(val); setCurrentPage(1); }}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              totalItems={productsData?.pagination?.total || 0}
            />
          </aside>

          {/* Mobile sidebar drawer */}
          {sidebarOpen && createPortal(
            <div className="fixed inset-0 z-[150] flex">
              <div className="absolute inset-0 bg-black/40" onClick={() => setSidebarOpen(false)} />
              <div className="relative w-72 max-w-[85vw] bg-white h-full overflow-y-auto shadow-xl">
                <Filters
                  category={category}
                  setCategory={(val) => { setCategory(val); setCurrentPage(1); }}
                  sortBy={sortBy}
                  setSortBy={(val) => { setSortBy(val); setCurrentPage(1); }}
                  itemsPerPage={itemsPerPage}
                  setItemsPerPage={(val) => { setItemsPerPage(val); setCurrentPage(1); }}
                  currentPage={currentPage}
                  setCurrentPage={setCurrentPage}
                  totalItems={productsData?.pagination?.total || 0}
                  onClose={() => setSidebarOpen(false)}
                />
              </div>
            </div>,
            document.body
          )}

          {/* Main content */}
          <main className="flex-1 min-w-0 px-4 sm:px-6 py-6">
            {isLoading && (
              <div className="fixed inset-0 bg-white/75 flex items-center justify-center z-50">
                <LoadingSpinner size="lg" />
              </div>
            )}

            {isError ? (
              <div className="text-center text-red-600 py-8">
                {productsError?.message || "Something went wrong while loading products."}
              </div>
            ) : (
              <ProductList
                products={productsData?.products || []}
                loading={isLoadingProducts}
                error={productsError}
                pagination={productsData?.pagination}
                onPageChange={handlePageChange}
                onAddToCart={addToCart}
                onWishlistToggle={handleWishlistToggle}
                onQuickView={openQuickView}
                wishlistItems={wishlist}
                itemsPerPage={itemsPerPage}
              />
            )}
          </main>
        </div>

        {/* ── Modals & overlays ── */}
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
          isInWishlist={wishlist.some((item) => item.productId === quickViewProductId)}
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
      </div>
    </ErrorBoundary>
  );
};

export default Products;
