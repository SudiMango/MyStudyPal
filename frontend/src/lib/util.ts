export const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
};

export const getErrorMessage = (error: any): string => {
    return (
        error.response?.data?.errorMessage ||
        error.message ||
        "An unexpected error occurred. Please try again."
    );
};
