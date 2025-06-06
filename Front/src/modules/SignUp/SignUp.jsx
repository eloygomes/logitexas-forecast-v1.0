import React from "react";

function SignUp() {
  async function handleSubmit(e) {
    e.preventDefault(); // Evita o comportamento padrão de recarregar a página

    // Captura os campos do formulário
    const email = e.target.email.value;
    const password = e.target.password.value;
    const confirmPassword = e.target.confirmPassword.value;

    // Verifica se as senhas conferem
    if (password !== confirmPassword) {
      alert("As senhas não coincidem!");
      return;
    }

    try {
      // Requisição para criar o usuário (Sign Up)
      const response = await fetch("https://api.logihub.space/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        // status 400, 500 etc.
        throw new Error(`Erro HTTP! status: ${response.status}`);
      }

      // Se deu certo, podemos redirecionar para a tela de login
      alert("Conta criada com sucesso! Faça login para continuar.");
      window.location.href = "/authentication/sign-in"; // Ajuste a rota conforme necessário
    } catch (err) {
      console.error("Erro ao criar conta:", err);
      alert("Erro ao criar conta ou usuário já existente.");
    }
  }

  return (
    <div className="w-full flex flex-col items-center justify-center px-6 pt-8 mx-auto pt:mt-0 dark:bg-gray-900">
      <a
        href="#"
        className="flex items-center justify-center mb-8 text-2xl font-semibold lg:mb-10 dark:text-white"
      >
        {/* Ajuste o caminho da imagem de logo, se necessário */}
        {/* <img src="/images/logo.svg" alt="Logo" className="mr-4 h-11" /> */}
        <span>LOGIHUB</span>
      </a>
      {/* Card */}
      <div className="w-full max-w-xl p-6 space-y-8 sm:p-8 bg-white rounded-lg shadow dark:bg-gray-800">
        <h2 className="text-2xl text-center font-bold text-gray-900 dark:text-white">
          Create a Free Account
        </h2>
        <div className="text-sm text-center font-medium text-gray-500 dark:text-gray-400">
          Already have an account?{" "}
          <a
            href="#"
            className="text-primary-700 hover:underline dark:text-primary-500"
          >
            Login here
          </a>
        </div>
        {/* onSubmit chama handleSubmit */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="email"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Your email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm 
                         rounded-lg focus:ring-primary-500 focus:border-primary-500 
                         block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 
                         dark:placeholder-gray-400 dark:text-white 
                         dark:focus:ring-primary-500 dark:focus:border-primary-500"
              placeholder="name@company.com"
              required
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Your password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              placeholder="••••••••"
              className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm 
                         rounded-lg focus:ring-primary-500 focus:border-primary-500 
                         block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 
                         dark:placeholder-gray-400 dark:text-white 
                         dark:focus:ring-primary-500 dark:focus:border-primary-500"
              required
            />
          </div>
          <div>
            <label
              htmlFor="confirmPassword"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Confirm password
            </label>
            <input
              type="password"
              name="confirmPassword"
              id="confirmPassword"
              placeholder="••••••••"
              className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm 
                         rounded-lg focus:ring-primary-500 focus:border-primary-500 
                         block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 
                         dark:placeholder-gray-400 dark:text-white 
                         dark:focus:ring-primary-500 dark:focus:border-primary-500"
              required
            />
          </div>
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="remember"
                aria-describedby="remember"
                name="remember"
                type="checkbox"
                className="w-4 h-4 border-gray-300 rounded bg-gray-50 
                           focus:ring-3 focus:ring-primary-300 
                           dark:focus:ring-primary-600 dark:ring-offset-gray-800 
                           dark:bg-gray-700 dark:border-gray-600"
                required
              />
            </div>
            <div className="ml-3 text-sm">
              <label
                htmlFor="remember"
                className="font-medium text-gray-900 dark:text-white"
              >
                I accept the{" "}
                <a
                  href="#"
                  className="text-primary-700 hover:underline dark:text-primary-500"
                >
                  Terms and Conditions
                </a>
              </label>
            </div>
          </div>
          <button
            type="submit"
            className="w-full float-right px-5 py-3 text-base font-medium text-center 
                       text-white bg-primary-700 rounded-lg hover:bg-primary-800 
                       focus:ring-4 focus:ring-primary-300 sm:w-auto 
                       dark:bg-primary-600 dark:hover:bg-primary-700 
                       dark:focus:ring-primary-800"
          >
            Create account
          </button>
        </form>
      </div>
    </div>
  );
}

export default SignUp;
