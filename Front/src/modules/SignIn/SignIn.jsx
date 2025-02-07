import React from "react";

function SignIn() {
  // Função para lidar com o envio do formulário
  async function handleSubmit(e) {
    e.preventDefault(); // evita recarregar a página

    // Captura dos campos do formulário
    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      // Requisição para sua rota de login
      const response = await fetch("https://api.logihub.space/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        // Se não for OK (200-299), lança erro
        throw new Error(`Erro HTTP! status: ${response.status}`);
      }

      const data = await response.json();
      // data deve conter { token: "..." }

      // Armazena o token no localStorage (ou sessionStorage)
      localStorage.setItem("token", data.token);

      // Redireciona (ajuste a rota conforme necessário)
      window.location.href = "/dashboard";
    } catch (err) {
      console.error("Erro ao fazer login:", err);
      alert("Credenciais inválidas ou erro ao fazer login.");
    }
  }

  return (
    <div className="w-full flex flex-col items-center justify-center px-6 pt-8 mx-auto pt:mt-0 dark:bg-gray-900">
      <a
        href="#"
        className="flex items-center justify-center mb-8 text-2xl font-semibold lg:mb-10 dark:text-white"
      >
        {/* Ajuste o path para a imagem de logo se necessário */}
        {/* <img src="/images/logo.svg" alt="FlowBite Logo" className="mr-4 h-11" /> */}
        <span>LOGIHUB</span>
      </a>

      {/* Card */}
      <div className="w-full max-w-xl p-6 space-y-8 sm:p-8 bg-white rounded-lg shadow dark:bg-gray-800">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Login
        </h2>
        <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
          Not registered?{" "}
          <a className="text-primary-700 hover:underline dark:text-primary-500">
            Create account
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

          <div className="flex items-start flex-wrap">
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
              />
              <div className="ml-3 text-sm">
                <label
                  htmlFor="remember"
                  className="font-medium text-gray-900 dark:text-white"
                >
                  Remember me
                </label>
              </div>
            </div>
            <div className="w-full flex flex-row">
              <div className="w-1/2 flex flex-col">
                <a
                  href="#"
                  className="ml-auto mt-4 text-left text-sm text-primary-700
                             hover:underline dark:text-primary-500 w-full"
                >
                  Lost Password?
                </a>
              </div>
              <div className="w-1/2">
                <button
                  type="submit"
                  className="w-full float-right px-5 py-3 text-base font-medium
                             text-center text-white bg-primary-700 rounded-lg
                             hover:bg-primary-800 focus:ring-4 focus:ring-primary-300
                             sm:w-auto dark:bg-primary-600 dark:hover:bg-primary-700
                             dark:focus:ring-primary-800"
                >
                  Sign In
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SignIn;
